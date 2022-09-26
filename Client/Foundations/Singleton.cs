using System.Reflection;

namespace UniRA2.Client.Foundations;

public static class SingletonContext
{
    private static readonly Dictionary<Type, object> SingletonContainer = new();

    private static T AutoCreateInstance<T>() where T : new()
    {
        var type = typeof(T);
        var ctor = type.GetConstructor(new Type[] { });
        if (ctor == null)
        {
            throw new ArgumentException("Only Empty Constructor is Allowed");
        }

        return (T)ctor.Invoke(null);
    }

    public static T Get<T>() where T : new()
    {
        var type = typeof(T);
        var hasValue = SingletonContainer.TryGetValue(type, out var value);
        if (hasValue)
        {
            return (T)value!;
        }

        value = AutoCreateInstance<T>();
        SingletonContainer[type] = value!;
        return (T)value!;
    }

    public static void Set<T>(T value)
    {
        if (value == null)
        {
            throw new ArgumentNullException(nameof(value));
        }

        SingletonContainer[typeof(T)] = value;
    }
}
