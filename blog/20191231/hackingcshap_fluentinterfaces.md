---
layout: default
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>HACKING C#: PROGRAMMING FOR THE TRULY LAZY</h2>
		<h3>Parte the Seconde: Fluent Function Interfaces</h3>
		<hr/>
		<div style="text-align: left">		

			<p><a href="https://www.thecodepainter.co.uk/blog/2019113/hackingcsharp_arrayadjust">In the first</a> part of this article series, I demonstrated a method for adjusting an Enumerable without having to first Enumerate it.  Here, I'll expand on that idea by providing the user with a friendlier, more verbose interface for making use of my Adjust method (or anything else you fancy using this method on).</p>
			
			<p>As before, my thinking is that it's more important in a codebase to be clear <strong>what</strong> is being achieved, rather than precisely <strong>how</strong> it is being done - unless there's a bug of course.  I prefer to write my business logic code so that it reads as closely in natural English to what is being done as possible.  The majority of the people who will maintain your code aren't interested in knowing every detail of the algorithm you use, but they may wish to add to or alter the rules you've already written.  </p>
			
			<p>Imagine you were in a hypothetical fast food restaurant, and to get food you had to provide a whole list of very specific things before you got your food.  Here it is illustrated by some very silly stick figures (because I can't draw!)<p>
			
			<div class="svg-container">
				<img src="interface_a.svg" width="80%" style="text-align: center">
			</div>
			
			<p>the <i>Selector</i> parameter of the Adjust function is itself a function delegate (i.e. a Func) that allows you to select either by the position of the current item in the array or by one or more properties of the current item.  I think it's neat, but the arrow function you write isn't very descriptive to anyone other than a fairly experienced dev.</p>
			
			<p>I <i>could</i> write two new functions - one for each style of item location, but that means duplicating code and increasing my maintenance overhead if I ever need to change the way it works.  I'll have to replicate any fixes to two otherwise identical functions, not one.  What I'd rather do is have a single function with a method contained within it to say what is is you want to do.</p>
			
			<p>The esssence of what I want to do is in this class:</p>
			
			<pre>
				<code class="cs hljs">
public class AdjustSelector&lt;T&gt;
{
	internal AdjustSelector() { }

	public Func&lt;T, int, bool&gt; ByPosition(int position) =&gt;
		(_, pos) =&gt; position == pos;

	public Func&lt;T, int, bool&gt; ByProp(Func&lt;T, bool&gt; predicate) =&gt;
		(obj, _) =&gt; predicate(obj);
}
				</code>
			</pre>	
			
			
			<p>For context, this class is in the assembly that otherwise only contains the static class for the Adjust extension method.  The reason it has an <i>Internal</i> Constructor is so that this can't be instantiated outside by anything other than code within the Adjust method - i.e. I don't want anyone else using it for any other purpose.</p>
			
			<p>Notice also that there are two sets of arrows in each of these arrow functions.  These are functions that generate functions - a very quick and easy form of Metaprogramming.  The Adjust requires a Func that converts a pair of parameters (i - the current array index and obj - the current item we've iterated to) into a Boolean (i.e. should we adjust or not) and each of the functions in AdjustSelector generates one of these Funcs. </p>
			
			<p>Here's how'd you'd integrate this into the Adjust function:</p>
			
			<pre>
				<code class="cs hljs">
public static IEnumerable&lt;T&gt; Adjust&lt;T&gt;(this IEnumerable&lt;T&gt; @this, Func&lt;AdjustSelector&lt;T&gt;, Func&lt;T, int, bool&gt;&gt; selector, T replacement) =&gt;
	@this.Adjust(selector(new AdjustSelector&lt;T&gt;()), replacement);
				</code>
			</pre>	
			
			<p>We create a new AdjustSelector class - something only something in this namespace can do - and then we pass it out to the user to make a selection of which form of selector they want to use.  If they want to select by location, they only need to give us an integer position.  If they want to go by property, then we need the arrow function that does the property selection logic.  You'd do it something like this:</p>
			
			<pre>
				<code class="cs hljs">
[Fact]
public void AdjustArrayByPosTwice()
{
	var stringArray = new[]
	{
		"a",
		"b",
		"c",
		"d"
	}
		.Adjust(x =&gt; x.ByPosition(2), "z")
		.Adjust(x =&gt; x.ByPosition(3), "y");
	stringArray.Should().Equal("a", "b", "z", "y");
}

[Fact]
public void AdjustArrayByProperties()
{
	var stringArray = new[]
	{
		"a",
		"bb",
		"cccc",
		"ddddd"
	}
		.Adjust(x =&gt; x.ByProp(y =&gt; y.Length == 2), "zz");
	stringArray.Should().Equal(
		 "a",
		"zz",
		"cccc",
		"ddddd");
}
				</code>
			</pre>	
			
		<p>These are extremely simple examples.  An adjust for a complex object with more detailed adjust requirements might look something like this:</p>
		
			<pre>
				<code class="cs hljs">
	complexArray.Adjust(x=&gt; x.ByProp(y =&gt; y.ProductType.Contains("fish"), DefaultProducts.FishProduct)
				.Adjust(x=&gt; x.ByProp(y =&gt; y.Description.Length &gt; 50), DefaultProducts.ProductWithInvalidDescription)
				</code>
			</pre>	
		
		<p>What I'm trying to do is to help the user step-by-step to get to the behaviour they want, but without having to worry in the slightest about how it's being done.  Someone could pick up a function like Adjust, which requires a slightly unusual Func parameter, but be guided through the available options (prop or pos) and be requested to only provide simple parameters in each step.  No need to peep into my code to understand what it's doing before you start using it.  It's also using more plain english in the codebase, which should provide a greater deal of self-documentation in what's written using it.</p>
		
		<p>If we return now to our stick-figure fast-foot customer, there's hopefully a happier experience being had by everyone:</p>
		
			<div class="svg-container">
				<img src="interface_b.svg" width="80%" style="text-align: center">
				<img src="interface_c.svg" width="40%" style="text-align: center">
			</div>
		
		
		<p>Hopefully you'll agree that none of this is especially hard to do, and the only slightly ugly looking code is locked away in a static class somewhere that no-one is likely to ever have to see.</p>
		