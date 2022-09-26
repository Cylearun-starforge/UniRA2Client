using ClientFoundations = UniRA2.Client.Foundations;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UniRA2.Client.UnitTest.Foundations
{
	[TestClass()]
	public class SingletonContextTests
	{
		class TestAutoCreate
		{
			public int A = 1;
			public string B = "Test";
		}

		[TestMethod()]
		public void GetTest()
		{
			var obj = ClientFoundations.SingletonContext.Get<TestAutoCreate>();
			Assert.AreEqual(obj.A, 1);
			Assert.AreEqual(obj.B, "Test");
		}
	}
}