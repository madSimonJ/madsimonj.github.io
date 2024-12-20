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

<p>Now, there are ways of implementing memoisation with an extension method (do have a look at <a href="https://learning.oreilly.com/library/view/functional-programming-with/9781492097068/"> my book</a> for a whole chapter on how to do that), but you can also modify a Dictionary a little to get a similar effect.  Consider this extension method:</p>

			<pre>
				<code class="cs hljs">
public static TValue TryGetKey&lt;TKey, TValue&gt;(this IDictionary&lt;TKey, TValue&gt; @this, TKey key, Func&lt;TKey, TValue&gt; f)
{
    if(@this.ContainsKey(key)) 
        return @this[key];
    var newValue = f(key);
    @this.Add(key, newValue);
    return newValue;
}
				</code>
			</pre>

<p>So what's happening here?  What I'm saying with the TryGetKey extension is - first give the key value that should be looked up.  If it's already in the dictionary, the cached version is returned.  If it's not in the dictionary, then the second prameter is a Func delegate which is used to calculate the value, which is then stored and returned to the user from storage.  It does mean using non-funcitional code inside the extension method, but I'm actually at peace with that.  It's a small bit of hidden-away imperative code, which then allows a very funcitonal style of coding everywhere else.</p>

<p>Here is an example of how you might use it on a simple function that returns the current DateTime:</p>

			<pre>
				<code class="cs hljs">
var functionToRun = (int x) => x.ToString() + " - " +  DateTime.Now.ToString();

var dict = new Dictionary&lt;int, string&gt;();

var tryOne = dict.TryGetKey(1, functionToRun);
var trytwo = dict.TryGetKey(1, functionToRun);
var trythree = dict.TryGetKey(1, functionToRun);
Console.WriteLine(tryOne);
Console.WriteLine(trytwo);
Console.WriteLine(trythree);
				</code>
			</pre>

<p>What happens when you run this code is that the same DateTime is printed 3 times, with the number "1" prefixed each time.  The first time TryGetKey is called, the Key "1" isn't found in the dictionary, so the provided function (functionToRun) is called, with "1" being the parameter supplied to it.  It calculates a string, which is stored in the dictionary.  When the same function is called for a second time, the cached value from the dictionary is returned, instead of re-calculating with a new date.  You could theoretically also supply a different function with the same signature each time too, but you'd still only get the same string back each time you call it.</p>

<p>What if you had 2 parameters on your function?  Could We also make a version of this process for that?  Funny you should ask, because yes we can! Here it is:</p>

			<pre>
				<code class="cs hljs">
public static TValue TryGetKey&lt;TKey1, TKey2, TValue&gt;(this IDictionary&lt;(TKey1,TKey2), TValue&gt; @this, TKey1 key1, TKey2 key2, Func&lt;TKey1,TKey2, TValue&gt; f)
    where TKey1: notnull
    where TKey2: notnull
{
    if(@this.ContainsKey((key1, key2))) 
        return @this[(key1,key2)];
    var newValue = f(key1, key2);
    @this.Add((key1,key2), newValue);
    return newValue;
}
				</code>
			</pre>

<p>What we're doing here is using a Tuple of the two key values together as a key, rather than just a single item by itself.  Other than that, it's the exact same process.  And this can be extended as many times as your project requirements need!  Make a version of this wtih 10 parameters if that's really what floats your boat!  I'm not sure that's entirely advisable, mind.  </p>

<p>This is how you'd use the two parameter version to memoise an add function:</p>

			<pre>
				<code class="cs hljs">
var dict = new Dictionary&lt;(int, int), int&gt;();

var tryOne = dict.TryGetKey(1,2, functionToRun);
var trytwo = dict.TryGetKey(1, 2,functionToRun);
var trythree = dict.TryGetKey(1, 2,functionToRun);
Console.WriteLine(tryOne);
Console.WriteLine(trytwo);
Console.WriteLine(trythree);
				</code>
			</pre>

<p>In every instance the text writen to the console is the number "3", but it's only actually calculated a single time.  The 2nd and 3rd calls to TryGetKey return a value from cache. </p>

<p>Now, these are trivial examples you probably wouldn't bother to memoise in real life, but imagine that behind these simple key-value pairs, there was an incredibly complicated function with database calls, web api calls, etc. all involved to arrive at an answer.  With this memoisation technique you can save every answer, to avoid calculating it afresh every time.  So long as the dictionary remains in scope while you do your calculations.  It can also be used on algorithms that involve processing the same data multiple times - like solutions to the Travelling Salesman problem, which involve calculating the distances between each node and every other node in a data graph.  Memoisation saves the computer needing to constantly calculate the same thing unnecessarily.</p>

<p>Have fun with this, and let me know if you think of any improvements.</p>

<p>And incidentally.  A merry Christmas to all of you at home!</p>