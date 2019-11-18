---
layout: default
---

<div class="pagepanel down_arrow white">
  <div class="center">
	<div style="text-align: left">
		<h2>HACKING C#: PROGRAMMING FOR THE TRULY LAZY</h2>
		<h3>Parte the Firste: Adjustable Arrays</h3>
		<hr/>
		
			<p>Welcome to my very first blog entry.  Do please wipe your feet on the way in and try not to leave any mess.  Beers are in the fridge, help yourselves!</p>
			
			<p>This is the first in a series of articles I'm planning to write on ways to help you with some of the techniques I've used over the years to accomplish a whole load more in C# with as little effort as I can get away with.  I'm very much of the opinion that life is too short to spend writing the same old boilerplate code, and that every problem only ever needs to be solved once.  Hopefully this article series will open your eyes a little to what can be done with a bit of imagination.</p>
			
			<p>A common enough scenario you might encounter is that - given an array - you need to adjust one of its records.  If you're following best practice, then you'll be referencing arrays between functions in their most abstract form - the IEnumerable&lt;T&gt; - and if not, why not? </p>
			
			<p>If you've got an array of items referenced as such, then it's trivial to update a specific item, you'd just do it like this:</p>
			
			<pre>
				<code class="cs hljs">
	var arrayOfStuff = new[] { "a", "b", "c", "d" };
	arrayOfStuff[2] = "z";

	// arrayOfStuff = { "a", "b", "z", "d" }			
				</code>
			</pre>		

			<p>Easy, right?  Here's the thing though - an IEnumerable isn't an array, nor is it even data - it's a collection of function calls that tell you how to get data.  Let me show you what I mean:</p>
			
			<div class="svg-container">
				<img src="array-a.svg" width="50%" height="50%" style="text-align: center">
			</div>
			
			<p>An ordinary array looks like the picture above, a simple collection of data.  And if we wanted to replace the item at Index=2 with "z", we'd just assign that value in directly to array[2].
			
			<p>A subject for another day is methods you can use to crack open an IEnumerable and create your own custom behaviour.  The problem we face if we want to amend the item at index 2, like we did above, is that the IEnumerable doesn't necessarily know where the item as index position 2 <strong>is</strong> or even if there <strong>is</strong> an item 2, until it starts making function calls to iterate through the Enumerable.  How then do we amend our value?</p>
			
			<p>The sort've method I usually see that people deploy in production is something like this:</P>
			
			<pre>
				<code class="cs hljs">
			
	public static IEnumerable&lt;string&gt; Adjust(IEnumerable&lt;string&gt; oldArray, int indexPos, string replacement)
	{

		var oldArrayAsArray = oldArray.ToArray();
		oldArrayAsArray[indexPos] = replacement;
		return oldArrayAsArray;

	}
			
				</code>
			</pre>	
		
			<p>I don't like this approach for several reasons.  </p>
			
			<p>Firstly, because we've had to crack open the IEnumerable early - potentially before we've finished all the other operations we need to apply to it - and we're returning a new Enumerable based on a modified version of the data from the original.  That's work the application would be better of delaying as late as possible, in case other changes negate the need for this operation, or in other cases there might be an expensive operation required to gather the data which we'd rather save until later.  It's not just me that wants to be lazy when coding, even the application itself ought to be able to work however it wants to!</p>
			
			<p>It's also repetetive.  If you've got 20 alterations to make, then we're going to enumerate the array 20 times, once for each alteration - even though we only change a single item of data each time.</p>
			
			<p>Finally, the code just doesn't look very elegant. </p>
			
			<p>C# is an amazing language. I've been working with it since not long after it was created, and I'm a big fan.  It has its limitations though, and I don't think we should feel the need to write boilerplate code like this to work around those limitations.  There is, after all, always a better way.</p>
			
			<p>This is what I'd consider doing instead:</p>
			
			<p>Step 1 - a new extension method to write and stick in an innocuous class somewhere at the back of your codebase:</p>
			
			<pre>
				<code class="cs hljs">
			
	public static IEnumerable&lt;T&gt; Adjust&lt;T&gt;(this IEnumerable&lt;T&gt; @this, Func<AdjustSelector&lt;T&gt;, Func&lt;T, int, bool&gt;&gt; selector, T replacement) =>
		@this.Adjust(selector(new AdjustSelector&lt;T&gt;()), replacement);
	
				</code>
			</pre>	
			
			<p>Step 2 - Call it instead of writing a new function to update your array:</p>
			
			<pre>
				<code class="cs hljs">
			
	var arrayOfStuff = new[] { "a", "b", "c", "d" };
	var array2 = stringArray.Adjust((x, i) => i == 2, "z");

	// arrayOfStuff = { "a", "b", "z", "d" }

				
				</code>
			</pre>	
			
			
			<p>So what have we done here?  We've created a new IEnumerable in the Adjust extension method, one which holds the original Enumerable as a local variable - referenced as @this.  Because we're trading an Enumerable for an Enumerable, nothing is actually evaluated properly until we enumerate through the values - or call ToArray/ToList - later in the code.  We've put a filter layer over the top of the original layer, which will mostly just pass through the original value for each item we enumerate through - unless certain criteria are true, in which case the replacement value is returned instead of what we'd otherwise have returned.</p>
			
			<p>It's done using an overloaded version of the Linq Select operator - one which takes an arrow function with two parameters: the current item in the array (of type T, which I've referenced as 'x') and the current index value within the list (an integer, which I've referenced as 'i').  In my function, I've created an arrow function that returns true if the current index location is 2, in which case the Adjust function will replace whatever that item would have been with a "z".</p>