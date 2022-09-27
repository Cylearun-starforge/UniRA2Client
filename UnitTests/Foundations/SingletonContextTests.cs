using ClientFoundations = UniRA2.Client.Foundations;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UniRA2.Client.UnitTest.Foundations
{
	[TestClass]
	public class SingletonContextTests
	{
		[TestMethod]
		public void GetTest()
		{
			var obj = ClientFoundations.SingletonContext.Get<TestAutoCreate>();
			Assert.AreEqual(obj.A, 1);
			Assert.AreEqual(obj.B, "Test");
		}


		[TestMethod]
		public void DetermineNonParamConstructor()
		{
			var obj = ClientFoundations.SingletonContext.Get<WithMultiConstructor>();
			Assert.AreEqual(obj.A, 1);
			Assert.AreEqual(obj.B, "Test");
		}

		[TestMethod]
		public void GetValueType()
		{
			var a = ClientFoundations.SingletonContext.Get<SomeStruct>();
			Assert.AreEqual(a.A, 1);
			Assert.AreEqual(a.B, 'B');
		}
	}
}

internal struct SomeStruct
{
	public int A;
	public char B;

	public SomeStruct()
	{
		A = 1;
		B = 'B';
	}
}

internal class TestAutoCreate
{
	public int A = 1;
	public string B = "Test";
}

internal class WithMultiConstructor
{
	public int A;
	public string B;

	public WithMultiConstructor(int a, string b)
	{
		A = a;
		B = b;
	}

	public WithMultiConstructor()
	{
		A = 1;
		B = "Test";
	}

	public WithMultiConstructor(int a)
	{
		A = a;
		B = "Test2";
	}
}