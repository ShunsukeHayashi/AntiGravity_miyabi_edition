/**
 * Logger テスト
 */

import { Logger } from '../logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger({ level: 'debug', format: 'text' });
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('log levels', () => {
    it('should log debug messages', () => {
      logger.debug('debug message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('info message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log warn messages', () => {
      logger.warn('warn message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      logger.error('error message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('log level filtering', () => {
    it('should not log debug when level is info', () => {
      logger = new Logger({ level: 'info' });
      logger.debug('debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log info when level is info', () => {
      logger = new Logger({ level: 'info' });
      logger.info('info message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('context', () => {
    it('should log with context', () => {
      logger.info('message', { key: 'value' });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('message')
      );
    });
  });

  describe('format', () => {
    it('should format as JSON when configured', () => {
      logger = new Logger({ level: 'info', format: 'json' });
      logger.info('test message');

      const loggedValue = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(loggedValue)).not.toThrow();
    });
  });
});
