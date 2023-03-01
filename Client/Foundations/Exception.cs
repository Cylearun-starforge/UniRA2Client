using System.Text;

namespace UniRA2.Client.Foundations
{
    internal static class ExceptionExtension
    {
        public static string PrettyToString(this Exception exception)
        {
            var buffer = new StringBuilder(256);
            buffer.AppendLine(exception.Message);
            var stackTrace = exception.StackTrace;
            if (stackTrace != null)
            {
                buffer.AppendLine(stackTrace);
            }

            return buffer.ToString();
        }
    }
}
