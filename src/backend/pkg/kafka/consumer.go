package kafka

import (
	"context"

	"github.com/segmentio/kafka-go"
	"github.com/your-repo/blockchain-integration-service/pkg/config"
	"github.com/your-repo/blockchain-integration-service/pkg/logger"
)

// Consumer represents a Kafka consumer
type Consumer struct {
	reader *kafka.Reader
	log    *logger.Logger
}

// NewConsumer creates a new Kafka consumer
func NewConsumer(cfg *config.Config, log *logger.Logger) (*Consumer, error) {
	// Create a new kafka.Reader with the provided configuration
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: cfg.KafkaBrokers,
		Topic:   cfg.KafkaTopic,
		GroupID: cfg.KafkaGroupID,
	})

	// Create and return a new Consumer instance with the reader and logger
	return &Consumer{
		reader: reader,
		log:    log,
	}, nil
}

// ConsumeMessages consumes messages from a Kafka topic
func (c *Consumer) ConsumeMessages(ctx context.Context, handler func([]byte, []byte) error) error {
	// Start an infinite loop to continuously consume messages
	for {
		// Use the reader to fetch the next message
		msg, err := c.reader.FetchMessage(ctx)
		if err != nil {
			// If an error occurs during fetch, log it and continue
			c.log.Error("Error fetching message", "error", err)
			continue
		}

		// Call the provided handler function with the message key and value
		if err := handler(msg.Key, msg.Value); err != nil {
			// If the handler returns an error, log it
			c.log.Error("Error handling message", "error", err)
		}

		// Commit the message offset
		if err := c.reader.CommitMessages(ctx, msg); err != nil {
			c.log.Error("Error committing message", "error", err)
		}

		// If the context is done, break the loop
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}
	}
}

// Close closes the Kafka consumer
func (c *Consumer) Close() error {
	// Close the kafka.Reader
	err := c.reader.Close()
	if err != nil {
		c.log.Error("Error closing Kafka consumer", "error", err)
	} else {
		c.log.Info("Kafka consumer closed successfully")
	}
	// Return any error that occurred during closure
	return err
}

// Human tasks:
// - Implement unit tests for the Consumer struct and its methods
// - Add support for consuming from multiple topics
// - Implement error handling and retries for failed message processing
// - Add support for manual offset management
// - Implement a method to pause and resume consumption
// - Add support for consumer groups and partition rebalancing
// - Implement metrics collection for consumer performance
// - Add support for message deserialization (e.g., JSON, Avro)
// - Implement a method to seek to a specific offset
// - Add support for handling consumer rebalance events