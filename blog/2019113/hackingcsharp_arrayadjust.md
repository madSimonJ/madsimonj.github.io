---
layout: default
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>HACKING C#: PROGRAMMING FOR THE TRULY LAZY</h2>
		<h3>Parte the Firste: Adjustable Arrays</h3>
		<hr/>
		<div style="text-align: left">		
			<p>Welcome to my very first blog entry.  Do please wipe your feet on the way in and try not to leave any mess.  Beers are in the fridge, help yourselves!</p>
			
			<p>This blog was posted as part of the <a href="https://crosscuttingconcerns.com/The-Third-Annual-csharp-Advent">Third Annual C# Advent</a>.  Make sure to check out everyone else's work when you're done here</p>
			
			<p>This is the first in a series of articles I'm planning to write on some of the techniques I've used over the years to accomplish a whole load more in C# with as little effort as I can get away with.  I'm very much of the opinion that life is too short to spend writing the same old boilerplate code, and that every problem only ever needs to be solved once.  Hopefully this article series will open your eyes a little to what can be done with a bit of imagination.</p>
			
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
				<img src="array-a.svg" width="30%" style="text-align: center">
			</div>
			
			<p>An ordinary array looks like the picture above, a simple collection of data.  And if we wanted to replace the item at Index=2 with "z", we'd just assign that value in directly to array[2].
			
			<p>An Enumerable on the other hand looks more like this:</p>
			
			<div class="svg-container">
				<img src="array-c.svg" width="50%" height="50%" style="text-align: center">
			</div>

			<p>It's more like a box with two buttons - "get the current item", and "move to the next item".  It doesn't necessarily know how many items there are, where they are, or anything else about them until it has iterated over to look.  In our simple example, above, there's just an array at the back of it, which isn't much different in principle to the original array diagram.  But an Enumerable doesn't necessarily just point to a simple data structure.  It could contain functions:</p>

			<div class="svg-container">
				<img src="array-b.svg" width="50%" height="50%" style="text-align: center">
			</div>

			<p>These might be simple data converting functions, or they could be expensive database or I/O operations that will each take time to execute.  The beauty of an Enumerable is that you can define it at the beginning of a function, but until an item from an Enumerable is requested for the first time to use in something else, those functions won't be executed at all.  Also, if logic later on would prevent the use of the data in the Enumerable, then it will actually <strong>never</strong> execute those functions, saving us time and resources we simply don't need to use up.  In an ideal world, we'll leave data defined behind an Enumerable for as long as possible, so that we only access it as and when it's needed and not before.</p>

			<p>The problem we face if we want to amend the item at index 2, like we did at the start of this article, is that the Enumerable doesn't necessarily know where the item as index position 2 is or even if there <strong>is</strong> an item 2, until it starts making function calls to iterate through the data.  How then do we amend our value without losing all the benefits of the Lazy Evaluation that an Enumerable gives us?</p>
			
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
			
			<p>Firstly, because we've had to crack open the Enumerable early - potentially before we've finished all the other operations we need to apply to it - and we're returning a new Enumerable based on a modified version of the data from the original.  That's work the application would be better of delaying as late as possible, in case other changes negate the need for this operation, or in other cases there might be an expensive operation required to gather the data which we'd rather save until later.  It's not just me that wants to be lazy when coding, even the application itself ought to be able to work however it wants to!</p>
			
			<p>It's also repetetive.  If you've got 20 alterations to make, then we're going to enumerate the array 20 times, once for each alteration - even though we only change a single item of data each time.</p>
			
			<p>Finally, the code just doesn't look very elegant. </p>
			
			<p>What you're effectively doing is this:</p>
			
			<div class="svg-container">
				<img src="array-d.svg" width="80%" style="text-align: center">
			</div>
			
			<p>You're starting with one Enumerable, reading through it so that you have a solid set of values.  Creating a new array based on it, then returning that with a new enumerable attached.  That's almost twice the amount of work being done in order to amend a single value from the whole array.  That's trivial with the little array I have created here, but what if there were thousands of values in it?</p>
			
			<p>C# is an amazing language. I've been working with it since not long after it was created, and I'm a big fan.  It has its limitations though, and I don't think we should feel the need to write boilerplate code like this to work around those limitations.  There is, after all, always a better way.</p>
			
			<p>This is what I'd consider doing instead:</p>
			
			<p>Step 1 - a new extension method to write and stick in an innocuous class somewhere at the back of your codebase:</p>
			
			<pre>
				<code class="cs hljs">
	public static IEnumerable&lt;T&gt; Adjust&lt;T&gt;(this IEnumerable&lt;T&gt; @this, Func&lt;T, int, bool&gt; shouldReplace, T replacement) =&gt;
		@this.Select((obj, pos) =&gt;
			shouldReplace(obj, pos)
			   ? replacement
			   : obj);
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
			
			
			<p>So what have we done here?  We've created a new IEnumerable in the Adjust extension method, one which references the original Enumerable as if it were a local variable - named here as @this.  Because we're trading an Enumerable for an Enumerable, nothing is actually evaluated properly until we enumerate through the values - or call ToArray/ToList - later in the code.  We've put a filter layer over the top of the original layer, which will mostly just pass through the original value for each item we enumerate through - unless certain criteria are true, in which case the replacement value is returned instead of what we'd otherwise have returned.</p>
			
			<p>The function at a symbolic level looks like this:</p>
			
			<div class="svg-container">
				<img src="array-f.svg" width="80%" style="text-align: center">
			</div>
			
			<p>We've taken two things as inputs - a replacement string (i.e. a "z" string) and a predicate (fancy term for a function that will tell you whether a condition has been met - in our case "i ==2" - i.e. we're on the third element (index=2) of the array), and they we merge them together into a new function that runs the predicate, and either returns the replacement string ("z") if it's true, or the unchanged original input if false.
			
			<p>:</p>
			
			
			<p>Using this method, you can now string as many alternations to the original array (or whatever other data source it might be) onto the original Enumerable without every having to waste processor time enumerating it more than once.  This way we're not only saving computer time, but also writing code that's more consise, easier to read and easier to maintain.  If you were to run "Adjust" - say - three times, instead of creating multiple arrays with slightly different values, you'd actually end up with something like this:</p>
			
			<div class="svg-container">
				<img src="array-g.svg" width="80%" style="text-align: center">
			</div>
			
			<p>Each call to the Adjust function effectively creates another filter layer between the Enumerator and the actual array.  When the "current" value is requested by the enumerator, then a value will be requested from the array, and passed through each Adjust function in turn - to see whether it should be returned as-is, or replaced with something else.  If you'd like to see what that final function would look like, complete with the actual order of operations - it'd be something like this:</p>
			
			<pre>
				<code class="cs hljs">
	public IEnumerable&lt;T&gt; AdjustArray(IEnumerable&lt;T&gt; input)
	{
		var inputArray = input.ToArray();
		var outputArray = new T[inputArray.Length]
		for(var i = 0; i < inputArray.Length; i++) 
		{
			if(i == 1)
				outputArray[i] = "x";
			else if(i == 2)
				outputArray[i] = "y";
			else if(i == 3)
				outputArray[i] = "z";
			else
				outputArray[i] = inputArray[i];
		}
		
		return outputArray;
	}
			</code>			
		</pre>
			
			<p>I hope you'll agree that my method is significantly easier to read:</p>
			
			<pre>
				<code class="cs hljs">
	public IEnumerable&lt;T&gt; AdjustArray(IEnumerable&lt;T&gt; input) =>
		input.Adjust((x, i) => i == 1, "x")
			 .Adjust((x, i) => i == 2, "y")
			 .Adjust((x, i) => i == 3, "z")
			</code>			
		</pre>
			
			<p>We can take this a step further though, to make this even easier to read and work with.  In  <a href="">Part Two</a> of this series, I'll look at creating fluent interfaces to slightly complicated functions like this.</p>
			