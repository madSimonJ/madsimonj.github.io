---
layout: blog
title: Saving Christmas with Functional C#
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

<p>What I'm going to do over the course of this article is show some of the techniques I use to write functional C#, but without having to resort to any non-functional code whatsoever.  </P>

<h3>Structuring the Answer</p>

<p>Unlike Object-Oriented code, functional code tends to be structured less around the detail of how exactly a result object is built up and in which order - rather it tends to be written in a way that's more closely linked to how the process works <i>logically</i> - as in, like the way you'd describe the steps you'd take to solve a problem if you were talking to another human being (assuming you are one.  AIs are getting pretty clever now, I must remind myself!).  Functional programming is less concerned with the details how exactly how and when things were built up, rather it focuses on what is <i>wanted</i>.  The details of the order of operations, etc. are not really of any interest.</p>

<p>You may wonder how you'd accomplish something like that in C#.  A large chunk of the answer is the use of LINQ.  LINQ was developed based on the functional paradigm.  Select statements don't alter the original Enumerable, they create a new one, based on the old.  They also take functions as parameters.  Both of these techniques are functional.  This isn't a coincidence.  The .NET team have a stated goal of supporting both paradigms in C#, and every version of C# for years now has consistently included further functional features.</p>




