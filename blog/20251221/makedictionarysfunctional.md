---
layout: blog
title: Functional Programming With C# - The Monads Were Here the Whole Time!!
description: Not only does C# support Monads....but they were always here....
---


<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Functional Programming with C#</h2>
		<h3>The Mondas Were Here the Whole Time!</h3>
        <h4>Done as part of the <a href="https://www.csadvent.christmas/">C# Advent</a></h4>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="" width="50%" style="text-align: center" alt="">
			</div>

<p>If you ask most people what a Monad is...actually, bad start.  Most people aren't in IT.  They'd just get confused and ask if you wanted sugar in that coffee or not.  OK, if you ask most developers what a Monad is...you'd likely get a similar reaction, if I'm honest.  Relatively few people know what one is, what you do with it, or why you should care.  But - what if I were to tell you that not only are they useful, not only does C# support them, but they've been in C# for decades already!  Don't believe me?  Well, follow me... </p>
<h4>What is a Monad?</h4>
<p>Let's addres the monadic elephant in the room first - what is it?  Let me try explaining with a parable.</p>
<p>Imagine you've been handed a device.  It's probably pretty cool.  If you press the button on the side it makes a perfect gingerbread latte with a little gingerbread man next to it.  Delicious.  All you have to do is load the beans in the top <i>just</i> right, and use the correct brand of cream and <i>exactly</i> the right brand of cinammon.  If you don't - it explodes and knocks one of the walls of your house down.  That's bad.</p>
<p>So, what do you do with this thing?  You really, really like gingerbread lattes, but sometimes you don't get everything loaded exactly right.  And for that matter, sometimes your kids pop in to have a go too.  They're young, but they like a latte.  Can you really trust them to get it right?</p>
<p>Here's what you do - you talk to your friend down at bomb disposal.  She's got one of those dome things they pop over a suspicious package which will either contain the explosion, or allow it to make a latte without a problem.  It's a safe environment into which you can pass the device so it can run, then the results can be shown to you, so you can decide whehter to drink them, or pop them in the nearest bin.</p>
<p>You see?</p>
<p>A monad is something that is passed a function which could have all sorts of unforseen consequences when it executes - like an unhandled exception, and allows it to run safely.  Then lets you decide what to with the results.  There are loads of different oness with different purposes.  The Result and Either monads are mostly about trapping unhandled exceptions & preventing them from leaking outside the execution environment.  The Opion or Maybe monad is about trapping nulls, so the null reference exeption does't happen.  There are more too, but these - at least in a C# concept are among the more useful.</p>
<h4>Let's Make a Monad</h4>
<p>Just to show you how it's done, here's one of the simplest and most useful monads you could make.  Result.  It has one input - a function.  It outputs either one of two possible objects - Success (the function worked) or Failure (it exploded and leaked gingerbread powder everywhere).  First thing we need is something to return and for that we need a static class and a bit of inheritance:</p>
<pre>
	<code class="cs hljs">
public interface Result&lt;T&gt; { }
public readonly record struct Success&lt;T&gt;(T Value)  : Result&lt;T&gt;;
public readonly record struct Failure&lt;T&gt;(Exception e): Result&lt;T&gt;;

	</code>
</pre>
<p>I'm using readonly record structs instead of classes to enforce that nothing is allowed to change value once instantiated - another funtional principle.  I'm also using inheritance here to implement - slightly inelegantly - something called a Union type or Distriminated Union.  It's basically a type that is either A or B.  Typescript has this.  In our case, Result is <i>either</i> a success <i>or</i> a failure.</p>
<p>Next, we need an environment to do the execution and return the right thing.  Easiest way to do that is assume our initial input is a Success (i.e we haven't done anything yet, so no exceptions are possibole) and shove it into a Success object, like this:</p>
<pre>
	<code class="cs hljs">
public static class ResultExtensions
{
	public static Result&lt;T&gt; ToResult(this T value) =>
		new Success(value);
}
	</code>
</pre>
<p>This is basically the equivalent of taking a piece of paper with either Sucess or Failure on it, then shoving it into an envelope marked "Result" via a bit of polymophism.  You know whatever is inside the envelope is one of those, but you don't know until you open it and look.</p>
<p>Next thing needed is the code to run the function you want to run:</p>
<pre>
	<code class="cs hljs">
public static class ResultExtensions2
{
	public static Result&lt;TOut&gt; Bind&lt;TIn, TOut&gt;(this TIn input, Func&lt;TIn, TOut&gt; functionToExecute)
	{
		try
		{
			if(input is Success&lt;TIn&gt; s)
			{
				return functionToExecute(s.Value).ToResult();
			}
			else if(input is Failure&lt;TIn&gt; f)
			{
				return new Failure&lt;TOut&gt;(f.Error);
			}
		}
		catch(Exception e)
		{
			return new Failure&lt;TOut&gt;(e);
		}
	}
}
	</code>
</pre>
<p>Some unpacking is required here to understand what I've done.  Firtly there are two generics - TIn and TOut.  TIn is whatever the input to the funtion is, TOut is whatever type it returns.  It's also handling three possible circumstances:</p>
<ul>
	<li>Input is a Success, meaning we can open the envelope, grab the value, and stuff it into the function, which doesn't fail - so we return another Success where 'T' is the new Output type</li>
	<li>Input is a success, but running the function results in an error - we return a Failure containing the error</li>
	<li>Input is a failure - it failed on a previous execcution, so let's not bother running the function, as we have no input to give it, so let's just pass the error message on, but with the correct type assigned to TOut</li>
</ul>
<p>Here are examples of those in code:</p>
<p></p>
<p></p>
<p></p>
<p></p>





<p>And incidentally.  A merry Christmas to all of you at home!</p>