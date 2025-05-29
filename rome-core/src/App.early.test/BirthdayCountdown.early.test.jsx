import React from 'react'
import BirthdayCountdown from '../App';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking React components and hooks
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: originalReact.useState,
    useEffect: originalReact.useEffect,
  };
});

describe('BirthdayCountdown() BirthdayCountdown method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    test('should display the current date and time correctly', () => {
      // Render the component
      render(<BirthdayCountdown />);

      // Check if the current date and time are displayed
      const dateContainer = screen.getByText(/Current Date & Time/i);
      expect(dateContainer).toBeInTheDocument();
    });

    test('should display the correct countdown message when it is not the birthday', () => {
      // Render the component
      render(<BirthdayCountdown />);

      // Check if the countdown message is displayed
      const countdownMessage = screen.getByText(/Until your next birthday!/i);
      expect(countdownMessage).toBeInTheDocument();
    });

    test('should display a birthday message on the birthday', () => {
      // Mock the Date object to simulate the birthday
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
          return new originalDate(2023, 6, 24); // July 24, 2023
        }
      };

      // Render the component
      render(<BirthdayCountdown />);

      // Check if the birthday message is displayed
      const birthdayMessage = screen.getByText(/Happy Birthday!!!/i);
      expect(birthdayMessage).toBeInTheDocument();

      // Restore the original Date object
      global.Date = originalDate;
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle leap year birthdays correctly', () => {
      // Mock the Date object to simulate a leap year birthday
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
          return new originalDate(2024, 1, 29); // February 29, 2024
        }
      };

      // Render the component
      render(<BirthdayCountdown />);

      // Check if the countdown message is displayed
      const countdownMessage = screen.getByText(/Until your next birthday!/i);
      expect(countdownMessage).toBeInTheDocument();

      // Restore the original Date object
      global.Date = originalDate;
    });

    test('should handle the transition from one year to the next', () => {
      // Mock the Date object to simulate New Year's Eve
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
          return new originalDate(2023, 11, 31, 23, 59, 59); // December 31, 2023, 23:59:59
        }
      };

      // Render the component
      render(<BirthdayCountdown />);

      // Check if the countdown message is displayed
      const countdownMessage = screen.getByText(/Until your next birthday!/i);
      expect(countdownMessage).toBeInTheDocument();

      // Restore the original Date object
      global.Date = originalDate;
    });
  });
});