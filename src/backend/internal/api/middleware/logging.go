package middleware

import (
	"bytes"
	"io/ioutil"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// LoggingMiddleware is a middleware function to log incoming HTTP requests and outgoing responses
func LoggingMiddleware(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Create a copy of the request body
		var requestBody []byte
		if c.Request.Body != nil {
			requestBody, _ = ioutil.ReadAll(c.Request.Body)
			c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(requestBody))
		}

		// Create a custom response writer to capture the response
		blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = blw

		// Record the start time of the request
		start := time.Now()

		// Call the next handler in the chain
		c.Next()

		// Calculate the request duration
		duration := time.Since(start)

		// Log the request details
		log.Infof("Request: %s %s | Status: %d | Duration: %v | Request Body: %s | Response Body: %s",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			duration,
			string(requestBody),
			blw.body.String(),
		)
	}
}

// bodyLogWriter is a custom response writer that captures the response body
type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

// Write captures the response body and writes it to the original writer
func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

// Human tasks:
// TODO: Implement log level configuration (e.g., debug, info, warn, error)
// TODO: Add option to mask sensitive data in logs (e.g., passwords, tokens)
// TODO: Implement log rotation to manage log file sizes
// TODO: Add correlation IDs to track requests across multiple services
// TODO: Implement structured logging for easier parsing and analysis
// TODO: Add performance monitoring to track slow requests
// TODO: Implement log aggregation and centralized logging system integration
// TODO: Add option to log request headers for debugging purposes
// TODO: Implement custom log formatting options
// TODO: Add unit tests for the logging middleware