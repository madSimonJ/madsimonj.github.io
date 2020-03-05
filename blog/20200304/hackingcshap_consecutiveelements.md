---
layout: blog
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>HACKING C#: PROGRAMMING FOR THE TRULY LAZY</h2>
		<h3>Parte the Thirde: Compare Adjacent Array Elements</h3>
		<hr/>
		<div style="text-align: left">		
			<p>As shown in <a href="https://www.thecodepainter.co.uk/blog/2019113/hackingcsharp_arrayadjust">Part One</a> it's best to leave an Enumerable Un-enumerated for as long as possible - leaving potentially expensive operations delayed until absolutely needed.  Part One showed how to adjust an array without enumerating first.  This time we're going to look at a method to compare two adjacent array elements without forcing it into an array to use Indexes (i.e. arr[i] compared to arr[i+1]).</p>
			
			<p>Let's quickly whip up a problem to solve first.  Let's say I had an enumerable defined with these integer values:</p>
			
			<pre>
				<code class="cs hljs">
IEnumerable&lt;int&gt; arr = new[] { 1, 5, 9, 15, 16, 32 };
				</code>
			</pre>

			<p>What I'd like to do is work out whether there are any consecutive values in this array (there are - 15 and 16), but without enumerating it.  This is a pretty arbitrary, simple example - but what I'm trying to do is not to get too bogged down in the specifics of what I'm trying to achieve - just the technique.  Imagine instead that this integer array was an Enumerable pointing at a series of expensive DB operations that produce complex objects that you want to compare.  Maybe they're audit entries, or sales transactions from a particular customer - whatever you'd like.  I'm keeping it simple for now, though.</p>
			
			<p>What I'd like is something like this:</p>
			

			<pre>
				<code class="cs hljs">
public static bool ContainsConsecutiveNumbers(this IEnumerable&lt;int&gt; arr) =&gt;
	arr.Any((x, y) =&gt; y == (x + 1));
				</code>
			</pre>

			<p>In this code sample "x" and "y" represent adjacent values from the Enumerable - i.e. the first time it runs, it'll fetch 1 and 5 from the example array above.  I'm comparing y (the second value) against x+1, because that would mean that x is exactly 1 lower than y - i.e. they're consecutive.</p>
		
			<p>How do I do it though?  </p>
			
			<p>First of all I'll need to crack open the Enumerable and get the Enumerator - this is the "engine" that runs beneath the service.  It moves us through the Enumerable's elements and fetches each element as they are required.  </p>
			
			<p>Getting the enumerator is easy, here's the code to grab it, and pass on the user-supplied comparison function down to the next level:</p>
			
			<pre>
				<code class="cs hljs">
public static bool Any&lt;T&gt;(this IEnumerable&lt;T&gt; @this, Func&lt;T, T, bool&gt; f) =&gt;
	@this.GetEnumerator().Any(f);
				</code>
			</pre>
			
			<p>An Enumerator starts by default at array position -1 - i.e. before the start of the array itself.  To move to the first item in the sequence, we need to call MoveNext().  This returns True if there's another item to be returned and False if the end of the array has been reached.  What we want to do is to grab the first item, cache it, then hold it somewhere when we move to the second item, so we can compare them.  That code looks like this:</p>
			
			<pre>
				<code class="cs hljs">
public static bool Any&lt;T&gt;(this IEnumerator&lt;T&gt; @this, Func&lt;T, T, bool&gt; f)
{
	@this.MoveNext();
	return Any(@this, f, @this.Current);
}
				</code>
			</pre>

			<p>So, now we've got the Enumerator, the user-provided function and the first item from the array.  This means we're ready to actually iterate through the rest of the array:</p>
		
			<pre>
				<code class="cs hljs">
public static bool Any&lt;T&gt;(this IEnumerator&lt;T&gt; @this, Func&lt;T, T, bool&gt; f, T prev) =&gt;
	@this.MoveNext()
		? f(prev, @this.Current)
			? true
			: Any(@this, f, @this.Current)
		: false;
				</code>
			</pre>

			<p>There's a little bit to unpack here.  MoveNext is being used to move to the next item in the Enumerable, and the return value tells us whether we've reached the end or not (True if another array element is found, False if not).   For each item (aside from the first) we're passing it, and the cached previous item into the user-supplied function.  This is an "Any" function, so we return True at any point if the user-supplied function returns True, otherwise if we reach the end of the array, then we return False.  If this current iteration doesn't return True, then we call the function again (i.e. use recursion), this time passing the "current" item back to be the new "previous" item.</p>
			
			<p>Here's the process in (badly-drawn) pictures:</p>
			
			<p>Start with the Enumerator in its starting state - i.e. Position -1:</p>
			
			<div class="svg-container">
				<img src="arraya.svg" width="30%" style="text-align: center">
			</div>
			
			<p>Call MoveNext() to move to the first item (i.e. Position 0):</p>
			
			<div class="svg-container">
				<img src="arrayb.svg" width="30%" style="text-align: center">
			</div>
			
			<p>After getting the first item, we hold it in reserve, and move to the second item, so we can see them both at the same time:</p>
			
			<div class="svg-container">
				<img src="arrayc.svg" width="30%" style="text-align: center">
			</div>
			
			<p>The user-supplied function compares (x+1) with y - so 1+1 and 5.  2 and 5 aren't equal, so we iterate again.  This time 5 is passed as the new Previous item, and the Iterator moves on to 9 as the new Current</p>
			
			<div class="svg-container">
				<img src="arrayd.svg" width="30%" style="text-align: center">
			</div>
			
			<p>It eventually stops when we reach the 5th item in the array - 16, which does equal the previous value (15) incremented by 1.  This causes the entire function to return out with a True, and cascade that True all the way back to the top level.</p>
			
			<p>If you want a view of the whole thing at once, then the 4 calls made to the user-supplied function (f) look like this:<p>
			
			<div class="svg-container">
				<img src="arraye.svg" width="50%" style="text-align: center">
			</div>
			
			<p>There we are - all done!  We can aggregate an Enumerable down to a boolean value based on whether a condition is ever met in which we can compare adjacent items in pairs.  All this without losing the Lazy evaluation  feature of the Enumerable by forcing an Enumeration into an array.</p>
			
			
			
			