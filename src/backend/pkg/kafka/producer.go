package kafka

import (
	"context"
	"github.com/segmentio/kafka-go"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// Producer struct representing a Kafka producer
type Producer struct {
	writer *kafka.Writer
	log    *logger.Logger
}

// NewProducer creates a new Kafka producer
func NewProducer(cfg *config.Config, log *logger.Logger) (*Producer, error) {
	// Create a new kafka.Writer with the provided configuration
	writer := &kafka.Writer{
		Addr:     kafka.TCP(cfg.KafkaBrokers...),
		Balancer: &kafka.LeastBytes{},
	}

	// Create and return a new Producer instance with the writer and logger
	return &Producer{
		writer: writer,
		log:    log,
	}, nil
}

// SendMessage sends a message to a Kafka topic
func (p *Producer) SendMessage(ctx context.Context, topic string, key, value []byte) error {
	// Create a new kafka.Message with the provided topic, key, and value
	msg := kafka.Message{
		Topic: topic,
		Key:   key,
		Value: value,
	}

	// Use the writer to write the message
	err := p.writer.WriteMessages(ctx, msg)
	if err != nil {
		// If an error occurs, log it and return the error
		p.log.Error("Failed to send message to Kafka", "error", err)
		return err
	}

	// If successful, log the message details and return nil
	p.log.Info("Message sent to Kafka", "topic", topic, "key", string(key))
	return nil
}

// Close closes the Kafka producer
func (p *Producer) Close() error {
	// Close the kafka.Writer
	err := p.writer.Close()

	// Log the closure of the producer
	if err != nil {
		p.log.Error("Error closing Kafka producer", "error", err)
	} else {
		p.log.Info("Kafka producer closed successfully")
	}

	// Return any error that occurred during closure
	return err
}

// Human tasks:
// - Implement unit tests for the Producer struct and its methods
// - Add support for batch message sending
// - Implement retry logic for failed message sends
// - Add support for message compression
// - Implement a method to flush the producer
// - Add support for Kafka transactions
// - Implement metrics collection for producer performance
// - Add support for custom partitioning strategies
// - Implement a method to check the health of the Kafka connection
// - Add support for dynamic topic creation