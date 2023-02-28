using System.CommandLine;
using System.CommandLine.Binding;
using System.IO;

namespace UniRA2.Client.CommandLine;

internal class DevBinder : BinderBase<DevModel>
{
    private readonly Argument<FileInfo> _manifestArgument;

    public DevBinder(Argument<FileInfo> manifestArgument)
    {
        _manifestArgument = manifestArgument;
    }

    protected override DevModel GetBoundValue(BindingContext bindingContext)
    {
        return new DevModel(bindingContext.ParseResult.GetValueForArgument(_manifestArgument));
    }
}

internal class SingleBinder : BinderBase<SingleModel>
{
    private readonly Argument<string> _modFolderArgument;

    public SingleBinder(Argument<string> modFolderArgument)
    {
        _modFolderArgument = modFolderArgument;
    }

    protected override SingleModel GetBoundValue(BindingContext bindingContext)
    {
        return new SingleModel(bindingContext.ParseResult.GetValueForArgument(_modFolderArgument));
    }
}
