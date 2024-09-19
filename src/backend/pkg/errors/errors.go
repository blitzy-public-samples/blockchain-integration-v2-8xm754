package errors

import (
	"fmt"
	"net/http"
)

// AppError represents a custom application error
type AppError struct {
	Message    string
	StatusCode int
	Err        error
}

// Error implements the error interface for AppError
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// New creates a new AppError instance
func New(message string, statusCode int, err error) *AppError {
	return &AppError{
		Message:    message,
		StatusCode: statusCode,
		Err:        err,
	}
}

// NewNotFoundError creates a new NotFound error
func NewNotFoundError(message string) *AppError {
	return New(message, http.StatusNotFound, nil)
}

// NewBadRequestError creates a new BadRequest error
func NewBadRequestError(message string) *AppError {
	return New(message, http.StatusBadRequest, nil)
}

// NewInternalServerError creates a new InternalServerError
func NewInternalServerError(message string, err error) *AppError {
	return New(message, http.StatusInternalServerError, err)
}

// Human tasks:
// TODO: Implement unit tests for each error creation function
// TODO: Add more specific error types (e.g., UnauthorizedError, ForbiddenError)
// TODO: Implement a method to convert AppError to a JSON response
// TODO: Add support for error codes in addition to HTTP status codes
// TODO: Implement a method to wrap errors with additional context
// TODO: Add support for localization of error messages
// TODO: Implement a central error handler for the application
// TODO: Add logging integration for errors
// TODO: Implement a method to sanitize error messages for external users
// TODO: Add support for custom error formatting for different output types (e.g., CLI, API)