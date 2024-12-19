---
layout: blog
title: Functional Programming With C# - Make Dictionaries Functional!
description: A simple technique to 
---


<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Functional Programming with C#</h2>
		<h3>Make Dictionaries Functional</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="" width="50%" style="text-align: center" alt="">
			</div>

<p>I love dictionaries - they're one of my favourite features of C#, besides all the other parts that are also my favourite that is!  I love the simple, elegant syntax, and the efficient lookup they bring to aid the performance of your algorithms.  They have a couple of shortcomings, though.  Like their tendancy to crash, burn and then also explode a bit if you ever try looking up an item that doesn't exist.  They also require a call to a decidedly non-functional "Add" function if you ever want to add to them, which would otherwise make them perfect for an implementation of a functional concept known as "Memoisation", which can massively boost performance.</p>

<p>In this article, I'm going to give you a few ideas for how to get around the many shortcomings of the Dictionary, and also how to Memoise with them, without resorting to non-functional style code.</p>

<h4>Stop the Boom!</h4>

<p>First, let's find a way to stop the dictionary exploding at the slightest sign of a problem.  As they are, they're brilliant, but you need to put so much defensive code around them that you lose a lot of the benefit they bring, or else suffer a very fragile codebase.</p>

<p>Let's start by looking at my test case, a very simple dictionary:</p>

			<pre>
				<code class="cs hljs">

var dict = new Dictionary&lt;int, string&gt;
{
    { 1, "one" },
    { 2, "two" },
    { 3, "three" },
    { 4, "four" }
};

Console.WriteLine(dict[1]);
Console.WriteLine(dict[5]);

				</code>
			</pre>

<p>If I run this code without modifying anything, then I'll get an unhandled exception on the line that attempst to find the item "5" in the dictionary.  Here's a quick and dirty method, which involves converting the dictionary to a lookup function with a default value that only takes a few lines of code:</p>


			<pre>
				<code class="cs hljs">

public static class DictExtensions
{
	public static Func&lt;Key, TValue&gt; ToLookup&lt;Key, TValue&gt;(this IDictionary&lt;Key, TValue&gt; @this, TValue defaultValue)
		where TKey : notnull
	{
		return x => 
			@this.TryGetValue(x, out var val) ? val : defaultValue;
	}
}
				</code>
			</pre>

<p>Using this method, the dictionary can be converted over to a function that keeps the original dictionary quietly tucked away in memory somewhere, but also acts as a gatekeeper between it and the Key being provided by the outside world, to ensure nothing bad happens.  The only difference in useage is that function parenteses are used instead of square brackets:</p>


			<pre>
				<code class="cs hljs">

var dict = new Dictionary&lt;int, string&gt;
{
    { 1, "one" },
    { 2, "two" },
    { 3, "three" },
    { 4, "four" }
}.ToLookup("I don't know");

Console.WriteLine(dict(1));
Console.WriteLine(dict(5));
				</code>
			</pre>

<p>Running this code would result in the console displaying the word "one" followed by the text "I don't know".  No errors need apply!  It does mean changing the syntax slightly, however.  There is another option you could follow if you basically want to use a Dictionary, that behaves like a dictionary in every sense, except that the awkward tendency to detonate is removed.  This is the option you've got in that case:</p>

			<pre>
				<code class="cs hljs">


public class DefaultDictionary&lt;TKey, TValue&gt; : Dictionary&lt;TKey, TValue&gt;
    where TKey : notnull
{
    private readonly TValue _defaultValue;
    public DefaultDictionary() {this._defaultValue = default; }
    public DefaultDictionary(TValue defaultValue) { this._defaultValue = defaultValue; }


    public new TValue this[TKey key]
    {
        get
        {
            if (!TryGetValue(key, out var val))
            {
                val = this._defaultValue;
                Add(key, val);
            }
            return val;
        }
        set { base[key] = value; }
    }
}
				</code>
			</pre>

<p>This DefaultDictionary class inherits from the standard Dictionary, but overrides its indexer, meaning that this function is called instead of the default when using square brackets to get a value.  I've given two different constructors that can be used.  Either the version with no values supplied, which will result in a value of "default" being returned for unknown items - usually NULL, but not always.  In the second constructor, the user can supply their own default value.  I've done so in my updated dictionary test here:</p>

			<pre>
				<code class="cs hljs">
var dict = new DefaultDictionary&lt;int, string&gt;("I Don't Know")
{
    { 1, "one" },
    { 2, "two" },
    { 3, "three" },
    { 4, "four" }
};

Console.WriteLine(dict[1]);
Console.WriteLine(dict[5]);
				</code>
			</pre>

<p>This version works exactly as if it were a normal dictionary when used in your codebase, and as it inherits from Dictionary, and therefore also implements IDictionary, then you should be able to pass it around without making any real changes in order to just start using it.  Easy-peasy!</p>

<h4>Memoisation</h4>

<p>How about memoisation, how do we do that?  First-off - what <i>is</i> memoisation?  Put simply, it's the idea that if you call the same function twice, with the same parameter values, the function only calculates the answer a single time - the second time it returns a cached version.  Same basic idea as using a Memory Cache in .NET, but applied at a function level.  It depends on the function being written in such a way that you would <i>expect</i> the same answer back, given the same parameter values.</p>

<p>Now, there are ways of implementing memoisation with an extension method (do have a look at <a href="https://learning.oreilly.com/library/view/functional-programming-with/9781492097068/" my book</a> for a whole chapter on how to do that), but you can also modify a Dictionary a little to get a similar effect.  Consider this extension method:</p>

