package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
)

// Logger is a struct representing the custom logger
type Logger struct {
	logger *zap.Logger
}

// NewLogger creates a new logger instance
func NewLogger(cfg *config.Config) (*Logger, error) {
	// Create a new lumberjack logger for file rotation
	fileLogger := &lumberjack.Logger{
		Filename:   cfg.LogFilePath,
		MaxSize:    100, // megabytes
		MaxBackups: 3,
		MaxAge:     28, // days
	}

	// Create a custom encoder config for structured logging
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	// Create a zap core with both file and console outputs
	core := zapcore.NewTee(
		zapcore.NewCore(
			zapcore.NewJSONEncoder(encoderConfig),
			zapcore.AddSync(fileLogger),
			zap.NewAtomicLevelAt(zap.InfoLevel),
		),
		zapcore.NewCore(
			zapcore.NewConsoleEncoder(encoderConfig),
			zapcore.AddSync(os.Stdout),
			zap.NewAtomicLevelAt(zap.InfoLevel),
		),
	)

	// Create a new zap logger with the custom core
	zapLogger := zap.New(core)

	// Create and return a new Logger instance wrapping the zap logger
	return &Logger{
		logger: zapLogger,
	}, nil
}

// Info logs an info message
func (l *Logger) Info(msg string, fields ...zap.Field) {
	// Call the underlying zap logger's Info method with the provided message and fields
	l.logger.Info(msg, fields...)
}

// Error logs an error message
func (l *Logger) Error(msg string, fields ...zap.Field) {
	// Call the underlying zap logger's Error method with the provided message and fields
	l.logger.Error(msg, fields...)
}

// Debug logs a debug message
func (l *Logger) Debug(msg string, fields ...zap.Field) {
	// Call the underlying zap logger's Debug method with the provided message and fields
	l.logger.Debug(msg, fields...)
}

// Sync syncs the logger, ensuring all buffered logs are written
func (l *Logger) Sync() error {
	// Call the underlying zap logger's Sync method
	return l.logger.Sync()
}

// Human tasks:
// TODO: Implement unit tests for the logger package
// TODO: Add support for log levels configuration through the config file
// TODO: Implement a method to dynamically change log levels at runtime
// TODO: Add support for structured logging with custom fields
// TODO: Implement a method to rotate logs based on file size in addition to time
// TODO: Add support for remote logging (e.g., to a centralized logging service)
// TODO: Implement a method to sanitize sensitive information in logs
// TODO: Add support for context-aware logging
// TODO: Implement performance benchmarks for the logger
// TODO: Add support for log sampling to reduce volume in high-throughput scenarios