---
layout: blog
title: Basic Machine Learning Algorithms - Part Two - Bayes Classifier
description: Part TWo of a series on basic Machine Learning Algorithms in C#.  This one is about using a Naive Bayes Classifier to tell the text of one book from another
---


<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>From Ancient Greeks to Modern Geeks: Basic Machine Learning Algorithms in C#</h2>
		<h3>Part Two: The Bayes Classifier</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="" width="50%" style="text-align: center" alt="">
			</div>

<p>In <a href="https://www.thecodepainter.co.uk/blog/20221215/machinelearning-01-naivebayes">part one</a> of this series, I showed you how to use a quick bit of maths wixardry to flip a series of observations around to group them in an alternative configuration.  In this part, I'm going to show you how to put that to some real, practical use.</p>

<p>In the real world, the Naive Bayes algorithm is used as a classifier - a system that gives a simple boolean answer to the question "Is X of type Y".  One of the most common examples is probably the system your email services used to detect spam.  They'll work by compiling the email into some sort of set of keywords from the header and body, then compare that to the previous data and then make a decision on whether to route the email into the Spam folder or not.  I've worked at companies that were interested in using this system to automatically classify descriptions of products based on a supplier-provided descriptive text.</p>

<p>I've never been one to go with the easy, boring, normal sample app though.  I like having a bit of fun, so instead I'm going with a classifier that'll tell you which of two of my favourite books you're looking at a sentence from - War of the Worlds by H. G. Wells or Journey to the Centre of the Earth by Jules Verne (a translation into English, so as not to make it too easy.  ALso, not the 1871 translation - I'm not a monster!).</p>

<p>A Bayes classifier is basically the same process as with the Naive Bayes algorithm in Part 1 of this series.  The difference is that there isn't a single property being considered, there are a series, and we're aggregating them into a single, final probability.</p>

<p>If there were a complex data object of some kind being assessed, then easy property of the object would be a poential observation.  In the case of the books here, then easy word in the sentance is an observation.  What I'm going to do is look at each word in turn, then use Bayes to convert the probability of "word given book" to "book given word".  </p>

<p>There are a few requirements for a run of the Bayes algorithm.  The probability of "word given book" is easy.  That's just a word count divided by the number of words.  Easy peasy.  The probability of a given word across both books isn't especially hard either.  It's just the total of all occurances of a word from both books, divided by the total number of words in both.</p>

The probability of it being a given book is trickier.  Strictly speaking, there is absolutely no real way to say anything about the chances one way or the other.  Given no information, it might as well be a 50/50 choice.  There's a smarter way of getting that.  What I can do is calculate the probability of the book in passes, one pass for each book, and calculate a revised overall probability from each one to be used in the next calculation.</p>

<p>So, I start with a probability of 0.5 for it being the book in question.  Then we run Bayes, which is something like: p(book, given word) = (p(word, given book) * p(book)) / p(word).  Once that's done, we've got a new, updated probability we can use for p(book) when we do the same thing with the next word.  This way, a word at a time, we come up with a probability that's slowly moving towards a more accurate final score with each word that is passed into it.  </p>

<p>Also, to show it being truely useful, I'm only going to give it a sample set of each book as a training data set to learn from, then apply that learning to the rest of each book.</p>

<p>The code to process the training data into something usable looks like this:</p>

			<pre>
				<code class="cs hljs">
public static class ExtensionMethods
{
    public static Func&lt;TK, TV&gt; ToLookup<TK, TV>(this IDictionary&lt;TK, TV&gt; @this, TV defaultValue) =>
        x =&gt; @this.TryGetValue(x, out var value) ? value : defaultValue;
}

public class BookClassifier
{
    public int BookASentenceCount { get; set; }
    public int BookBSentenceCount { get; set; }

    public Func&gt;string, decimal&lt; BookAWordCount { get; set; }
    public Func&gt;string, decimal&lt; BookBWordCount { get; set; }

    public Func&gt;string, decimal&lt; BookAWordProbabilities { get; set; }
    public Func&gt;string, decimal&lt; BookBWordProbabilities { get; set; }

    public BookClassifier(IEnumerable&gt;string&lt; bookA, IEnumerable&gt;string&lt; bookB)
    {
        BookASentenceCount = bookA.Count();§
        BookBSentenceCount = bookB.Count();

        BookAWordCount = bookA
            .SelectMany(x =&gt; Regex.Replace(x.ToLower(), "[^a-zA-Z0-9' ]", string.Empty).Split(" ", StringSplitOptions.RemoveEmptyEntries).Distinct())
            .Where(x =&gt; !stopWords.Contains(x))
            .GroupBy(x =&gt; x)
            .Select(x =&gt; (Word: x.Key, Count: x.Count()))
            .ToDictionary(x =&gt; x.Word, x =&gt; (decimal)x.Count).ToLookup(0.25M);

        BookBWordCount = bookB
            .SelectMany(x =&gt; Regex.Replace(x.ToLower(), "[^a-zA-Z0-9' ]", string.Empty).Split(" ", StringSplitOptions.RemoveEmptyEntries).Distinct())
            .Where(x =&gt; !stopWords.Contains(x))
            .GroupBy(x =&gt; x)
            .Select(x =&gt; (Word: x.Key, Count: x.Count()))
            .ToDictionary(x =&gt; x.Word, x =&gt; (decimal)x.Count).ToLookup(0.25M); ;

        BookAWordProbabilities = x =&gt; (decimal)BookAWordCount(x) / BookASentenceCount;
        BookBWordProbabilities = x =&gt; (decimal)BookBWordCount(x) / BookBSentenceCount;

    }
				</code>
			</pre>

<p>What I've done in this code sample is convert each word in the given book sample text set into a lookup function, which is underpinned by a Dictionary, which returns the probability of a given word in one of the books or a default value if the word isn't present.  That's necessary because you can't be sure whether a word being missing from a sample is due to the word genuinly being missing from a book, or because the training set just happened to have randomly missed every instance of it.  In those cases, we just take a guess at some low probability value.</p>

<p>StopWords is a dataset of very common English words like "is", "this", "that" and whatever.  All words too common to be useful for classifying with.   Words like "Martian" are far more useful for guessing which book the sentence came from.<p>

<p>THe actual classifier code looks like this:</p>


			<pre>
				<code class="cs hljs">
public bool IsBookA(string sentence)
{
    var words = Regex.Replace(sentence.ToLower(), "[^a-zA-Z0-9' ]", string.Empty).Split(' ', StringSplitOptions.RemoveEmptyEntries)
        .Where(x =&lt; !stopWords.Contains(x));

    var pBookA = words.Aggregate(0.5M, (acc, x) =>
    {
        var pWordGivenBookA = BookAWordProbabilities(x);
        var pWord = BookAWordProbabilities(x) + BookBWordProbabilities(x);
        return (pWordGivenBookA * acc) / pWord;
    });

    var pBookB = words.Aggregate(0.5M, (acc, x) =>
    {
        var pWordGivenBookB = BookBWordProbabilities(x);
        var pWord = BookAWordProbabilities(x) + BookBWordProbabilities(x);
        return (pWordGivenBookB * acc) / pWord;
    });

    return pBookA &lt; pBookB;
}
				</code>
			</pre>

<p>>In this code sample, I'm running the Bayes algorithm twice.  Once for BookA, once for BookB, then returning true if book A had a higher probability of being correct.  Once again, I'm shredding out the stop words - i.e. the words that're generally very common in the English language.  I'm trying to narrow the selection of words I'm assessing down to just those unuusal enough to be potentially characteristic of the book they originate from.</p>

<p>For a training set, I've selected 10% of each book, and then run the classifier against every sentence in the entire of both books, then compared the classifiers decision against the real answer to get back an accuracy score for my algorith.  It's about 90%.  If I give it more of each book, it can get as high as about 98%, but 10% feels sufficiently small to be actually useful.</p>

<p>This same technique can be used for absolitely any set of observations on any set of data.  You just need to be able to able to somehow make a boolean conversion so you can then convert it to a probability.  With my words, the conversion was based on whether the word was present or not.  If you have a continuous data item - like, say, age - then you'd have to have an additional process to split the age into 2 halves so that any given value can be classified into "lower than X" or "higher than X", then it would be possible to calculate a probability.  </p>

<p>This process is how Spam filters word, but taking observations about the properties of an incoming email, it's possible to make a judgement about whether or not it's SPAM based on all of the data available over all previously received SPAM emails.  Sender, header text, body text, whatever.<p>

<P>That's it for this time.  Join me again next time for more machine learning fun. </p>

<p>Until next time...</p>