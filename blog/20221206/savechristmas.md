---
layout: blog
title: Saving Christmas with Functional C# - Part One
description: A few hints and tips about solving the Advent of Code purely functionally
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Saving Christmas with Functional C#</h2>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="" width="50%" style="text-align: center" alt="">
			</div>

<h4>Introduction</h4>

<p>As anyone that follows me on Twitter knows, <a href="https://learning.oreilly.com/library/view/functional-programming-with/9781492097068/">I'm writing a book!</a>  It'll be coming out hopefully in the summer, and it's about writing functional style code in C#.  It's been a lot of work, but hopefully it'll be worth it.  I'd planned to start a regular blog this year, but the book writing has put pay to that.  This is hopefully the first of a regular set of writings from me starting now, and into 2023. I'm also planning to upgrade this site to ReactJS and give it a better layout.  One thing at a time, though! </p>

<p>For this talk, I wanted to talk about one of my favourite things of the entire year - <a href="https://adventofcode.com/">the Advent of Code</a>.  If you aren't already aware, it's a series of code puzzles released in pairs each day of Advent.  Since functional programming is one of my <i>other</i> favourite things, that's the style of coding I use to solve the puzzles.  So first-off what is functional programming?</P>

<p>functional programming is a style of coding, not a framework, or a language itself.  It has the following properties:</p>

<ul>

	<li>Variables can't ever be changed once set (aka Immutability)</li>
	<li>Functions can be passed into functions as parameter or out of functions as return types (higher-order functions)</li>
	<li>No statements (If, For, ForEach, While, etc.)</li>
	<li>Functions that are "pure" - meaning they always return the same result for the same parameters</li>

	<li>Stateless - You can't change variables, so we can't have a state object.  State is an ephemeral emergent property of the system</li>
</ul>

<p>To make sure I'm following these rules, and since I don't need to worry about the additional complexities of things like interactions with a web API or database, or any unclean user input, I can go absolutely all-out with functional style code.  In fact, for the purposes of demonstration, I'm going to write everything entirely as arrow functions.  That makes it just about impossible to alter the value of a variable or include a statement.</P>

<p>What I'm going to do over the course of this article is show some of the techniques I use to write functional C#, but without having to resort to any non-functional code whatsoever.  </p>

<h3>Structuring the Answer</h3>

<p>Unlike Object-Oriented code, functional code tends to be structured less around the detail of how exactly a result object is built up and in which order - rather it tends to be written in a way that's more closely linked to how the process works <i>logically</i> - as in, like the way you'd describe the steps you'd take to solve a problem if you were talking to another human being (assuming you are one.  AIs are getting pretty clever now, I must remind myself!).  Functional programming is less concerned with the details how exactly how and when things were built up, rather it focuses on what is <i>wanted</i>.  The details of the order of operations, etc. are not really of any interest.</p>

<p>You may wonder how you'd accomplish something like that in C#.  A large chunk of the answer is the use of LINQ.  LINQ was developed based on the functional paradigm.  Select statements don't alter the original Enumerable, they create a new one, based on the old.  They also take functions as parameters.  Both of these techniques are functional.  This isn't a coincidence.  The .NET team have a stated goal of supporting both paradigms in C#, and every version of C# for years now has consistently included further functional features.</p>

<p>As for structuring the answer itself, my general approach is to keep everything split down as small as logically possible.  In Functional Programming, it's entirely possible to write the whole thing  as a massive chain of functions, but this has its problems.  For a start, it makes it harder to debug.  The latest versions of Visual Studio contain a lot more support for putting break points inside function chains, but older versions aren't great for it.  The second issue is testability - the fewer things that a function does, the easier it is to create robust tests that cover everything.  Finally, one of the points of the Advent of Code is that after completing Part One, you'll then be given a mystery varient Part Two to develop.  If you've kept your functions small, it's usually easy enough to re-use most of the same code from Part One again, just perhaps glued together in a different order, or with different parameters.</p>

<p>From a lower-level perspective, I create my answers in a Unit Test project, and I implement all of the examples given in each puzzle page as unit tests before I move on to the <i>actual</i> real puzzle input.  If I'm lucky, the real input works first time.  That's not really all that common, though!  I find the best approach is to imagine - logically - the steps of a problem, and implement the code in <i>that</i> order.  I find one of the beauties of functional programming is that you don't need to worry about laying down boilerplate code that won't be useful until later, the way you often have to with object-oriented code.</p>

<p>I would also ensure you're using as up-to-date a version of .NET as you can.  Microsoft are always releasing new functional features, so there's always likely to be a nifty new feature in the latest version, when it comes out.  Case in point, the latest version of LINQ contains a Chunk feature, for breaking arrays into even sized pieces.  That's incredibly useful for these puzzles.</p>

<h3>Really Learn LINQ</h3>

<p>This seems a bit basic, but you'd be surprised.  LINQ is far bigger than most people realise, and even I after decades of using it, still find the odd new feature I wasn't aware of before.</p>

<p>Here are a few less-well-known LINQ commands that it might be worth reading up on:</p>

<ul>
	<li>Zip - Link 2 arrays together into a sort've psueo-tuple.  The callback function will first see the first element from each array, then the second from each, and so on.  If the sizes differ, you'll only get as many elements returned as their are matches on both sides.  It's Not uinlike a T-SQL inner join</li>
	<li>Aggregate - Render an array of items down to a single, final result using a running total built up in increments.  Tremendously powerful when used well</li>
	<li>Chunk - new to .NET.  Splits a larger array up into a requested regular size</li>
	<li>Take & Skip - used to take a chunk from the middle of an Enumerable without necessarily enumerating it.  Newer versions of C# can also do this as a handy Python-style array select syntax - e.g. myArray[3..] or myArray[^4]</li>
	<li>Enumerable.Range - Create an array of integers where the first element is a specified and each subsequent element is 1 higher, continuing until there are many elements as you require.  Can be very useful for replacing the "var i" feature of a For-loop</li>
	<li>Enumerable.Repeat - create an array with X elements, each containing the same value</li>
	<li>Append - Create a new Enumerable, the same as the last, but with an additional item.  Saves the need to use a List</li>
	<li>Concat - As with Append, but you can pass another Enumerable, and get back a new one which has all values from the source arrays joined together</li>
</ul>

<p>Something to bear in mind though...</p>

<p>Enumerables implement lazy loading - meaning that data only comes out of them at the very latest possible moment. Until that, they're just the potential for data, pointing at a data source, with a few bits of logic that tell it how to transform it once received.  This is a very powerful feature, but it has a down side.  Until ToList or ToArray are called, all LINQ operations are just stacked up in memory until they're needed.  If you don't make sure that you call ToArray in the right places, it can cause a massive memory overhead that can bring your code screeching to a halt.<p>

<h3>Replacing Loops</h3>

<p>There are three fundamental types of loop in C# - For, ForEach and While.  Just about all of them can be replaced by other structures in functional-style C#.  I'll show you a few techniques here to accomplish that.<p>

<p>The most obvious way to get rid of the majority of ForEach loops is to use a LINQ Select function.  It can replace the OO approach of instantiating a List outside a ForEach loop and adding to it with each iteration.  If there are many operations to be performed, then Selects can be called, one after the other.  Alternatively, a more complex function can be written and referenced within the Select.  Here's an Example from this year's puzzles:</p>

			<pre>
				<code class="cs hljs">
private static int TopThreeCalories(string input) =>
	input.Split("\r\n\r\n")
		.Select(x => x.Split("\r\n"))
		.Select(x => x.Select(int.Parse))
		.Select(x => x.Sum())
		.OrderByDescending(x => x)
		.Take(3)
		.Sum();
				</code>
			</pre>

<p>If you look that function, we're starting with a single item - the input string, then splitting it up into an Enumerable of items, performing list-based operations on those items, before finaly aggregating down to a single return value.  That's a fairly typical functional flow.</p>

<p>We also need to replace For loops, however.  These days easily 90% or more of loops that I create are ForEach, because I don't necessarily care about the index position of the element I'm transforming from an Enumerable, but there are cases we still need the For loop to provide a value of i, so what options are there?</p>

<p>As it happens there are two.  The first is to use the overloaded version of the LINQ Select method, the one that takes 2 parameters.  The first parameter is the usual x we're all used to - the current element from the Enumerable.  The second is the index of the element - i.e. the i from a For loop.  That's the simplest method to have the index value available to you, and serves in the majority of cases.</P>

			<pre>
				<code class="cs hljs">

public static Stacks ParseStacks(IEnumerable&lt;string&gt; input) =&gt;
	input.Select(s =&gt; s.Chunk(4))
		.Select(x =&gt; x.Select(y =&gt; y[1]))
		.SelectMany(x =&gt; x.Select((y, i) =&gt; (Crane: i + 1, Crate: y)))
		.GroupBy(x =&gt; x.Crane)
		.ToDictionary(x =&gt; x.Key, x =&gt; x.Where(y =&gt; y.Crate != ' ').Select(y =&gt; y.Crate))
	
				</code>
			</pre>

<p>In this eample you can see the overloaded version of the Select at work to determine an arbitrary id value for a crane, so that I can perform a grouping afterwards.</p>

<p>The second method is to use Enumerable.Range, then perform a select against it.  This is an example where I was using it to build up a string, where a check had to be made to determine whether the current character overlapped with a rapidly changing variable, which was used to select the appropriate character to print to the result string.</p>

			<pre>
				<code class="cs hljs">
				
public static string RenderSpriteString(IEnumerable&lt;int&gt; input) =&gt;
		input.Zip(Enumerable.Range(0, 40))
		.Select(x =&gt; Math.Abs(x.First - x.Second) &lt; 2 ? '#' : '.')
		.Bind(x =&gt; new string(x.ToArray()));
	
				</code>
			</pre>

<p>A much more complicated problem is replacing While loops.  The previous two kinds of loop are instances of Definite loops - that is loops with a definite beginning and end.  Easy, uncomplicated loops.  What about <i>in</i>definite loops.  Ones where we're looping around indefinitely until an arbitrary condition is met.  How do we do those?</p>

<p>The classical approach in functional programming is to use recursion.  That isn't an approach I'd recommend in C#, however.  In F#, and in other more functional languages, it's perfectly possible to do recursion as a method of looping indefinitely, but in C# it has a <i>massive</i> memory overhead.  To the point that it can cause a stack overflow exception.  Unless you're very sure of what you're doing, I'd avoid the technique alltogether. </p>

<p>Where does that leave us, as functional c# developers?  Well, once again there are a variety of possible solutions, and I'll go into them in Part two of this article in a few weeks.</p>

<p>Until next time...</p>
