---
layout: blog
title: Oregon Trail Part Three - Riders on the Trail Ahead
description: Part three of a series on convering an old 1974 BASIC program into Functional C#
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Functional Programming in C#</h2>
		<h3>Oregon Trail Part Three: Riders on the Trail Ahead</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="/blog/20220227/Oregon3.png" width="50%" style="text-align: center" alt="Three cartoon horses with weapons">
			</div>
			
		<p>In <a href="~/blog/20211219/oregontrail_1">Part One</a> of this article series, I talked about the background to Oregon Trail, where and whom it came from, and I coded the basic feedback loop necessary to get the game working.  In <a href="~/blog/20220128/oregontrail_2">Part Two</a> I implemented the hunting mini-game, and a few other minor features.  In this article I'm beginning my look at the lengthy, complicated end-of-turn sequence.</p>
		
		<p>My apologies for being late with this article.  Things have been hectic over the last few weeks.  I've got a super-secret project on the go, which I hope to be able to make an announcement about soon, as well as being accepted for 3 NDC Conferences!  I'll be appearing at Porto, Copenhagen and Melbourne.  Exciting stuff, but as you can imagine, I've been busy!</p>
		
		<p>The first problem with this block of code was where to end it.  The end-of-turn sequence roughly consists of these steps:</p>
		
		<ul>
			<li>Determine whether There are Riders - done via a complex equation, designed to make it more or less likely there are riders at different points of the journey</li>
			<li>Randomly determine whether the riders look Friendly or Unfriendly - random decision</li>
			<li>Give the player the choice to run or fight</li>
			<li>Choose a random event.  There are a great many of these that can occur.</li>
			<li>Begin a new Day</li>
		</ul>
		
		<p>The problem is just how many possible events there are that can follow the resolution of the Riders ahead event, that any there may not be Riders at all a lot of the time, and all of these scenarios have to be tested.  The best idea I could come up with was to have a separate external dependency to handle all of the random events.  That way I don't need to worry about testing each and every possible next event value.</p>.
		
		<p>