using System.IO;
using System.Text;

namespace UniRA2.Client.Foundations
{
    public class Logger
    {
        private FileStream? _file;
        private readonly StringBuilder _buffer = new(64);

        private static readonly string[] LogLevelNames = {"DEBUG", "INFO", "WARN", "ERROR"};
        private uint _logLevel = 0;

        internal void Open(FileInfo file)
        {
            Close();
            if (file.DirectoryName != null)
            {
                Directory.CreateDirectory(file.DirectoryName);
            }

            _file = file.OpenWrite();
        }

        internal void Close()
        {
            _file?.Close();
        }

        internal uint LogLevel
        {
            get => _logLevel;
            set
            {
                if (LogLevelNames.Length <= value)
                {
                    throw new ArgumentOutOfRangeException(nameof(value));
                }

                _logLevel = value;
            }
        }

        private void WriteWithLevel(uint level, string message)
        {
            if (_file is null)
            {
                throw new InvalidOperationException("Logger _file is null");
            }


            // [level][date]message
            _buffer.Clear();
            _buffer.Append('[');
            _buffer.Append(LogLevelNames[level]);
            _buffer.Append(']');
            _buffer.Append('[');
            _buffer.Append(DateTime.Now);
            _buffer.Append(']');
            _buffer.AppendLine(message);
            _file.Write(Encoding.UTF8.GetBytes(_buffer.ToString()));
            _file.FlushAsync();
        }

        internal void Debug(string message)
        {
            WriteWithLevel(0, message);
        }

        internal void Info(string message)
        {
            WriteWithLevel(1, message);
        }

        internal void Warn(string message)
        {
            WriteWithLevel(2, message);
        }

        internal void Error(string message)
        {
            WriteWithLevel(3, message);
        }
    }
}
