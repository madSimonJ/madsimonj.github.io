---
layout: blog
title: Basic Machine Learning Algorithms - Part One: Naive Bayes
description: Part One of a series on basic Machine Learning Algorithms in C#.  This one is about Naive Bayes
---


<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>From Ancient Greeks to Modern Greeks: Basic Machine Learning Algorithms in C#</h2>
		<h3>Part One: Naive Bayes</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="" width="50%" style="text-align: center" alt="">
			</div>

<h4>Introduction</h4>

<p>Anyone familiar with my work so far will know that my usual topic is functional programming - specifically how to accomplish it in C#.  There are actually an awful lot of areas of interest in coding that I'm into, and among them is Machine Learning.  I've done a few talks touching on it in the past, like the one I've done on randomly generating a new book by Jane Austen using Markhov chains (have a hunt around on YouTube, there are a few recorded versions of it out there).  This time though,  I wanted to take a much deeper dive into the topic.  When it's over, I might have a think about practical applications, and see whether I can put a project together.</p>

<p>I'm also planning to do all of this in C#.  I'm aware that C# isn't the go-to language for most data scientists (take a bow, Python) but I wanted to do it this way for a couple of reasons. </p>

<p>The first is that C# is the language I know the best.  My day job is developing bespoke business applications in C#, and I've been doing it for coming on 2 decades now, so I'm pretty well versed in .NET.</p>

<p>The other is as a learning tool, not just for myself, but for any other .NET developers that want to get into Machine Learning, but are put off by the unfamiliar syntax of Python or R.  </p>

<p>The final reason is that there probably are .NET-based devleopment teams out there that want to start using a few bits and pieces of ML, but don't want to invest training time in learning a new language.  Hopefully these articles will help those teams out with a few hints as to how to get up and running.</p>

<p>One last note - I'm no expert on this subject.  I'm an enthusastic, coffee-fueled amateur when it comes to data science.  If anyone reading this realises I've made a mistake, or missed out on a better way to do things, then I'd love to hear from you.  We're hopefully all in this to keep learning & improving.  I certainly am.  I'm always grateful to anyone that can help me improve my knowledge of a subject.</p>

<h4>Bayes and his Algorithm</h4>

<p>As well as everything else, I'm a bit of a History nerd, so I wanted to start by talking a little about the background to the Bayes algorithm.  It was discovered by Thomas Bayes, an English Mathematician from the 1700s.  So far as I'm aware, we don't know a great deal about his life - there's no certainty that we even have a picture of any kind to show us what he looked like.  </p>

<p>Like a lot of educated men of that era, he was a member of the clergy.  He published a few papers offering opinions on mathematical topics, but that was about it during his lifetime.  His greatest contribution to the field was a set of notes he never intended for publication, that were nevertheless released to the public after his death.  It's from these that we get the famous Bayes Algorithm.</p>


<h4>What is it?</h4>

<p>Like a lot of Machine Learning algorithms, the Naive Bayes Algorithm relates to probability.  If you want a C# analogy, it's a way of doing a GroupBy of the properties of a set of probabilities.  Consider this example:</p>

<p>For some reason, we've got a set of 13 bags of Doctor Who stories, one for each Doctor (yes, I know it's a little more complicated than 13, bear with me) and we want to know for any given bag, what the chances are of it being a Dalek story.  It'd look something like this:</p>

<ul>

	<li><strong>1st Doctor (Hartnell)</strong> - 5/29 = 0.172 = 17.2%</li>
	<li><strong>2nd Doctor (Troughton)</strong> - 2/21 = 0.095 = 9.5%</li>
	<li><strong>3rd Doctor (Pertwee)</strong> - 4/24 = 0.167 = 16.7%</li>
	<li><strong>4th Doctor (T. Baker)</strong> - 2/41 = 0.049 = 4.9%</li>
	<li><strong>5th Doctor (Davison)</strong> - 1/20 = 0.05 = 5.0%</li>
	<li><strong>6th Doctor (C. Baker)</strong> - 1/8 = 0.048 = 4.8%</li>
	<li><strong>7th Doctor (McCoy)</strong> - 1/12 = 0.083 = 8.3%</li>
	<li><strong>8th Doctor (McGann)</strong> - 0/2 = 0 = 0%</li>
	<li><strong>9th Doctor (Eccleston)</strong> - 2/10 = 0.2 = 20%</li>
	<li><strong>10th Doctor (Tennant)</strong> - 3/36 = 0.083 = 8.3%</li>
	<li><strong>11th Doctor (Smith)</strong> - 3/39 = 0.172 = 17.2%</li>
	<li><strong>12th Doctor (Capaldi)</strong> - 1/35 = 0.172 = 17.2%</li>
	<li><strong>13th Doctor (Whittaker)</strong> - 5/26 = 0.192 = 19.2%</li>

</ul>

<p>Before there are any arguments, I'm only counting <strong>proper</strong> Dalek stories, where they're the main villains.  I'm not counting every episode that features one wandering around in the background somewhere.  Probably.  Like everything else in Doctor Who it's probably up for debate.  Even the number of episodes is a little arbitrary here.</p>

<p>So what we have so far is a list of probabilities that say "given this is a (for example) First Doctor story, the chances it is a Dalek story is X".  Using the Bayes algorithm, we can turn that on its head, and say "Given this is a Dalek story, the chances it is a First Doctor story is Y".</p>

<p>In case you're curious, the actual formula looks like this: P(c|x) = (P(x|c) * P(c)) / P(x).  That's a maths thing, though.  I'm not interested in precise mathematical definitions, I want the practical, engineers version, and that look more like this:<p>

<ol>
	<li>Select a Probability of "Daleks Given 1st Doctor" (i.e. 5/29 = 0.172)</li>
	<li>Multiply by probability of any random story being a 1st doctor story (i.e. 29/299 = 0.097 = 9.7%)</li>
	<li>Divide by the probabilty of any random story being a Dalek story (i.e. 27/299 = 0.090 = 9.0%)</li>
</ol>

<p>Following our example, that would mean that the probability a random Dalek story is a First Doctor story is 0.172 * 0.097 / 0.090 = 0.185 or 18.5%.</p>

<p>If you want to see some C# code to work out the results for all of the Doctors, it looks like this:</p>

			<pre>
				<code class="cs hljs">
// Item1 = # of Doctor
// Item2 = # of Stories
// Item3 = # of Dalek Stories
var DoctorDalekData = new[]
{
	(1, 29, 5),
	(2, 21, 2),
	(3, 24, 4),
	(4, 41, 2),
	(5, 20, 1),
	(6, 8, 1),
	(7, 12, 1),
	(8, 2, 0),
	(9, 10, 2),
	(10, 36, 3),
	(11, 39, 3),
	(12, 35, 1),
	(13, 26, 5)
};

var probabilityOfDalekGivenDoctor = DoctorDalekData.Select(x =&gt;
	(Doctor: x.Item1, Probability: x.Item3 / (decimal)x.Item2)
);

var totalStories = DoctorDalekData.Sum(x =&gt; x.Item2);
var totalDalekStories = DoctorDalekData.Sum(x =&gt; x.Item3);

var probabilityOfDoctor =
	DoctorDalekData.Select(x =&gt; (Doctor: x.Item1, Probability: (decimal)x.Item2 / totalStories))
		.ToDictionary(x =&gt; x.Doctor, x =&gt; x.Probability);
var probabilityOfDaleks = totalDalekStories / (decimal)totalStories;

var probabilityOfDoctorGivenDaleks = probabilityOfDalekGivenDoctor
	.Select(x =&gt; (
			Doctor: x.Doctor,
			Probability: x.Probability * probabilityOfDoctor[x.Doctor] / probabilityOfDaleks)
		);

var reportLines = probabilityOfDoctorGivenDaleks.Select(x =&gt;
	$"{x.Doctor}, {Math.Round(x.Probability, 2)}"
);

var reportHeader = "Doctor, Probability";

var report = reportHeader + Environment.NewLine + string.Join(Environment.NewLine, reportLines);
				</code>
			</pre>

<p>The result of running this code looks like this:</p>

Doctor, Probability<br>
1, 0.19<br>
2, 0.07<br>
3, 0.15<br>
4, 0.07<br>
5, 0.04<br>
6, 0.04<br>
7, 0.04<br>
8, 0<br>
9, 0.07<br>
10, 0.11<br>
11, 0.11<br>
12, 0.04<br>
13, 0.17<br>
<br>

<p>Looks like if I were a betting man, and we were inexplicably betting on which Doctor we'd get from a random bag of all of the Dalek stories on DVD, I'd put my money on the 1st or 3rd Doctors.</p>

<h4>What's it For?</h4>

<p>This was all good fun, but what's the point?  For one, we can now take an array of data items with a list of properties, and quickly and easily calculate a set of probabilities arranged around that property.  In our example, we went from a set of data about each Doctor, to a set of data based around all of the Dalek stories in the set, and how they break down by Doctor.  The same way a C# GroupBy function can be used to repivot a dataset around a chosen property.  Creating Pie Charts, or other reports is definitely a useful feature of this algorithm.  <p>

<p>There's another use.  We can also use this to classify things.  In Part 2, I'll show you how to use a Naive Bayes classifier identify an author by their writing style, among other things.</p>

<p>Until next time...</p>

