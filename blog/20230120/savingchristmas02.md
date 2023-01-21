---
layout: blog
title: Saving Christmas with Functional C# - Part Two
description: A few hints and tips about solving the Advent of Code purely functionally
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Saving Christmas with Functional C#</h2>
	  <h3>Part Two - Indefinite Loops</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="" width="50%" style="text-align: center" alt="">
			</div>


<p>This is part two of a series of blogs on how to solve coding challenges in C# with functional-style code. Part One can be found <a href="https://www.thecodepainter.co.uk/blog/20221206/savechristmas">here</a></p>

<p>Content from this article is based in part on content from my upcoming O'reilly book <a href="https://www.oreilly.com/library/view/functional-programming-with/9781492097068/">Functional Programming in C#</a> which is due to be published later this year</p>

<h4>Introduction</h4>

<p>In part one we looked at ways to use functional-style code to replace loops with definite durations with alternative coding structures.  This time, I'm looking at a far trickier kind of loop to replace - the <i>in</i>definite loop.  By this, I mean a loop that - when you start out - you don't know exactly how many iterations will occur before the end.  The most obvious example of this in C# is the While-loop.  With a While, you loop around indefinitely until a particular condition is met. </p>

<p>There simply isn't any way to use a LINQ Select statement to handle an indefinite loop.  A Select is predicated on the idea that you have a <i>definite</i> set of stuff, and the Select will start at the beginning and move on to the end.  Isn't it?  <i>Isn't</i> it?  Well...keep on reading...</p>

<h4>The Problem</h4>

<p>This time I'm going to focus on a single problem and demonstrate the various options that're available to us to solve it.  <a href="https://adventofcode.com/2022/day/12">Day 12</a> of 2022's advent series was one of the harder puzzles I encountered.  It's about trying to find an optimal route up a mountain, where there is a fixed amount of vertical distance that is permitted to be traversed per step.  In effect, it's about trying to find an optimal path through a network of connected nodes.  I'm not going to put the whole of my solution up in this article. It's <a href="https://github.com/madSimonJ/AdventOfCode2022/blob/main/xmas/Day12c.cs">here</a> if you want to have a look at it in all its glory, instead I just want to focus on one element - the part that requires an indefinite loop</p>

<p>The essence of how to solve this puzzle is to start on the end square, assign that a value of 0.  Then each of its neighbours get assigned a value of 1, then theirs a value of 2 and so on.  The value on each square is equal to the lowest value neighbour it has minus 1.  This process continues until the start square is reached, and it is assigned a value.  The value of the start square is the minimum distance required to trave from there to the end square</p>

<h4>Option 1 - Recursion</h4>

<p>I'm mentioning Recursion only in passing, since it's the classical solution to this problem.  For those that haven't encountered it before - recursion is a function that calls itself with modified parameters until a pre-determined condition is met, at which point a solid return value comes back instead of another function call.  In purer functional languages like F#, this sort of thing is not a problem, there are memory optimisation features in play that allow you to do it safely.  In c# however, there is a massive memory overhead.</p>

<p>If you think about it, each call to the recursive function that doesn't complete with a value is left in memory.  If there are only a few recusive calls to the same function, then this isn't too bad.  If however, there are many, then the problem of storing all of these unresolved function calls on the stack soon balloons out of control.  The likely result is either a function that takes forever to run, or else a Stack Overflow Exception.</p>

<p>Because of this, in the C# world, I don't recommend touching recursion at all, not unless you're certain there won't be many iterations.  If you absolutely, positivitely <i>have</i> to use recursion, then either change your solutiont to F#, or at least move that portion of the code into F# and reference it from your C# projects.</p>

<p>Remember - friends don't let friends use recursion.</p>

<h4>Option 2 - Trampolining</h4>

<p>This option - Trampolining - is probably the easiest and safest to implement.  I'm not going lie though, it's a bit of a cheat.  My implementation is an extension method called IterateUntil.  It starts with an object that represents the state of the loop and takes two parameters: a Func delegate to convert the old state into an updated version, a Func delegate that checks the current state to see whether the loop should end yet or not.  In my answer to the Day 15 puzzle, it looks like this:</p>


			<pre>
				<code class="cs hljs">
var grid = ParseGrid(input).Nodes.ToArray();
var start = grid.Single(x => x.height == destination);
var initialQueue = new Queue
{
	CurrentQueue = new[] { (start.x, start.y, start.height, 0) },
	AlreadySeen = new[] { (start.x, start.y, start.height, 0) }
};

var finalQueue = initialQueue.IterateUntil(x => x.AlreadySeen.Any(y => y.height == beginning) || !x.CurrentQueue.Any(),
	q =>
	{

		var currentItem = q.CurrentQueue.FirstOrDefault();
		var neighbours = new[]
		{
			grid.SingleOrDefault(x => x.x == currentItem.x + 1 && x.y == currentItem.y),
			grid.SingleOrDefault(x => x.x == currentItem.x - 1 && x.y == currentItem.y),
			grid.SingleOrDefault(x => x.x == currentItem.x && x.y == currentItem.y + 1),
			grid.SingleOrDefault(x => x.x == currentItem.x && x.y == currentItem.y - 1),
		}.ToArray();

		var neighboursToAdd = neighbours.Where(n =>
				n != default && IsClimbable(currentItem.height, n.height) &&
				!q.AlreadySeen.Any(z => z.x == n.x && z.y == n.y))
			.Select(x => (x.x, x.y, x.height, currentItem.weight + 1))
			.ToArray();

		var newQ = new Queue
		{
			CurrentQueue = q.CurrentQueue.Skip(1).Concat(neighboursToAdd).ToArray(),
			AlreadySeen = q.AlreadySeen.Concat(neighboursToAdd).ToArray()
		};

		return newQ;

	});

return finalQueue.AlreadySeen.Where(x => x.height == beginning).Min().weight;
}
	</code>
</pre>


<p>The first item to look at here is the first parameter to IterateUntil, that's the condition to terminate the loop.  In this case, it's examining an array of items already scanned by the function.  If any of the items added to the "already seen" list that have the same height as the beginning square - that would mean it <i>is</i> the beginning square (at least in this puzzle I'm allowed to assume so) and that means that the beginning has been scanned and there's no point in scanning any further squares.  That, or there simply aren't any further squares left to scan because the queue of squares to scan is empty, meaning there's no point to continuing.</p>

<p>The body of the funtion inside the second Func delegate is the system for updating the queue of squares to scan and the list of squares already scanned, along with their values.  Because we're writing functional-style code, the original state object is never changed, instead we create a new state object based on the old one.</p>

<p>This all seems fairly reasonable and functional, but how does trampolining work?  There are a few possible ways, but honestly, what they all boil down to in the end is this:</p>

			<pre>
				<code class="cs hljs">
public static T IterateUntil<T>(this T @this, Func<T, bool> cond, Func<T, T> f)
{
	var updated = @this;
	while (!cond(updated))
	{
		updated = f(updated);
	}

	return updated;
}
	</code>
</pre>

<p>If at some point you think that this looks awfully like a hidden While loop.  That's because...it's absolutely a hidden while loop.  The sad and terrible truth is that it's just about the only way to do this.</p>
<p>How acceptable is this?  Well, that's a question you'll have to ask yourself.  While you're at it add this question to the list - how functional do you want to be?</p>
<p>If your goal is to be as absolutely and utterly as functional as possible - which certainly is my goal - then this is probably the best result you can hope to achieve.  It's true that there's a While loop hidden in your codebase, which isn't functional programming.  But it's only <i>one</i>.  The rest of your codebase can be made fully functional.  The while loop in this etension method is probably going to be the only loop of its kind in your entire codebase, so that's still pretty good going.</p>
<p>Maybe one day Microsoft will release a structure of some kind for this purpose, in which case you can replace the implementation of IterateUntil with whatever that new code feature is, and the entire codebase goes back to being entirely functional.</p>
<p>Until then, this is one of the most optimal solutions you can manage.  Performance-wise it's nearly as good as it gets.  It's nowhere near as RAM-crippling as a recursion-based solution would be.</p>
<p>There is one more solution you can try too.  It's quite a bit more work, but it does give you a few more options compared to trampolining.</p>

<h4>Option 3 - Custom Enumerable</h4>

<p>The last, and wildest, option you can consider is creating your own implementation of the Enumerable interface and putting your own logic behind the scenes to control it's looping behaviour.  The actual implementation of an Enumerable is simple, it's a tiny class that requires an Enumerator to be returned.  It's the Enumerator that does all the work behind the scenes while iterating through an Enumerable:</p>

			<pre>
				<code class="cs hljs">
public class CustomEnumerable<T> : IEnumerable<T>
{
	private readonly CustomEnumerator<T> customrEnumerator;

	public CustomEnumerable(T state, Func<T, T> fTransformer, Func<T, bool> endState)
	{
		customrEnumerator = new CustomEnumerator<T>(state, fTransformer, endState);
	}

	public IEnumerator<T> GetEnumerator() => this.customrEnumerator;

	IEnumerator IEnumerable.GetEnumerator() => this.customrEnumerator;
}
}
				</code>
			</pre>

<p>Note here I'm taking 3 parameters to pass to the enumerator.  The initial state object (with a generic type of T), a Func delegate to transform the old state to new and a Func delegate to determine whether the end of the loop has arrived.  All of these items are fed into the Enumerator to play with.</p>

<p>The enumerator code looks like this:</p>

			<pre>
				<code class="cs hljs">
public class CustomEnumerator<T> : IEnumerator<T>
{
	private readonly T InitialState;
	private bool _conditionMet = false;
	private readonly Func<T, T> _fTransformer;
	private readonly Func<T, bool> _endState;

	public CustomEnumerator(T state, Func<T, T> fTransformer, Func<T,bool> endState)
	{
		this.Current = state;
		this.InitialState = state;
		this._fTransformer = fTransformer;
		_endState = endState;
	}

	public bool MoveNext()
	{
		this.Current = _fTransformer(this.Current);
		if (this._conditionMet)
			return false;
		if (this._endState(this.Current))
			this._conditionMet = true;
		return true;
	}

	public void Reset()
	{
		this.Current = InitialState;
	}

	public T Current { get; private set; }

	object IEnumerator.Current => Current;

	public void Dispose()
	{
		this.Current = default;
		this._conditionMet = true;
	}
}
		</code>
			</pre>

<p>The MoveNext function is the one that is called after each iteration of the Enumerable.  It's here we determine what the next version of the State object should look like, following the completion of the previous iteration.  That's the only bit of this Enumerator class we need to be all that concerned with.</p>
<p>Notice that there's a separation between determining we're done with iterating, and actually stopping.  That's becase without that bit of logic, the final state woud never be returned by the Enumerator and the end condition would always be wrong.</p>
<p>Using this method, I can now re-implement my IterateUntil function like this:</p>

			<pre>
				<code class="cs hljs">
public static T IterateUntil<T>(this T @this, Func<T, bool> cond, Func<T, T> f)
{
	var c = new CustomEnumerable<T>(@this, f, cond);
	var result = c.Last();
	return result;
}
				</code>
			</pre>

<p>Bear in mind that we've created an entire implementation of the Enumerable class, so when iterating through this, each version of the state that's ever existed during the process will each continue to exist as separate elements of an array.   If you wanted to, you could do something like this:</p>

			<pre>
				<code class="cs hljs">
var c = new CustomEnumerable<T>(@this, f, cond);
var results = c.Select(x => x);
				</code>
			</pre>

<p>In this version, the variable c isn't of type T (i.e. the state) instead it's an Enumerable<T> and if you were to call ToArray on it, you'd have an array containing the Starting state, the ending State and every single other version of the State obejct that happened inbetween.</p>
<p>Another thing you'd be able to do is to stop the process early after a set number of steps:</p>

			<pre>
				<code class="cs hljs">
var c = new CustomEnumerable<T>(@this, f, cond);
var results = c.Take(10);
				</code>
			</pre>

<p>Any LINQ operation can be applied to this custom Enumerable.  Whatever you'd like to do with the Enumerable you can - provided it's in LINQ.  </p>

<h4>Conclusion</h4>

<p>I looked at 3 different ways to solve the problems of Indefinite loops in Functional C#.  These were presented in ascending order of difficulty to implement</p>
<p>The first - Recursion is simple to throw together, but comes with a massive memory overhead.</p>
<p>The second - trampolining is perfectly memory efficient, but breaks one of the functional paradigm's rules in order to carry out its instructions.</p>
<p><The third, and last, option is a custom Enumerable.  This adds in the LINQ lazy-load feature to the behaviour of our Enumerable, as well as allowing any LINQ operation to be usable to change the behavior of the iteration process, but definted after the original Enumerable was created.</p>
<p>Which of these options you prefer is entirely a matter of personal preference.  How much work are you prepared to do?  How comfortable are you with code of this level of complexity?  </p>
<p>I can't answer any of these questions for you.  You'll have to think about it yourself, and decide which option you prefer.  </p>

<p>In the next article, I'm going to look into a process for improve the efficiency of your function without hardly needing to change anything.</p>

<p>Until next time...</p>
