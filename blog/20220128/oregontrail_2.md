---
layout: blog
title: Oregon Trail Part Two - It's Huntin' Season
description: Part two of a series on convering an old 1974 BASIC program into Functional C#
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Functional Programming in C#</h2>
		<h3>Oregon Trail Part Two: It's Huntin' Season</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="/blog/20220128/Blog2.png" width="50%" style="text-align: center" alt="Man holding a nintendo gun">
			</div>
	
	<p>In <a href="~/blog/20211219/oregontrail_1">Part One</a> of this article series, I talked about the background to Oregon Trail, where and whom it came from, and I coded the basic feedback loop necessary to get the game working.  In this Installment, I'm going to put some flesh on the bones and start working on the basic turn sequence.  I won't get it all done - there's an awful lot to it!  But I'll at least get most of it done.  At a guess, there are no more than one or two articles left in this series before I have it all wrapped up.</p>
	
	<p>The basic turn sequence of Oregon Trail runs something like this:</p>
	
	<ol>
		<li>Print the date, and feed back to the player about any statuses</li>
		<li>Ask the player whether they want to hunt - and on alternate days, prompt them to enter a fort to trade (I'll do forts another time)</li>
		<li>The hunting mini-game</li>
		<li>Prompt the player  to eat</li>
		<li>The "horse riders ahead" mini-game (I'll cover this next time)</li>
		<li>update all relevant statuses, determine whether or not the player is dead, loop back around for another turn</li>
	</ol>
	
	<p>As with before, the main turn engine is a switch operation that takes the old state, update information and generates a new state, so I've made a unit test for each and every possibility for what the player might do.</p>
	
	<p>One of the first states to check is whether or not this is a Fort turn.  These start on Turn (ie. Day) two, and recurr every other day along the trail.  The original BASIC code had an integer variable called x1 that it used to determine this.  It was either set to -1 for a non-fort turn, or 1 for a fort.  The switch was done as part of the set-up for each turn by simply multiplying x1 by -1.  Of course in C# we have access to more types than were available in BASIC, so a boolean is much more appropriate.  I've added a boolean Fort property to the state to hold that information, but I'll do Forts and trading another time.  For this phase of development, I want to focus on the Hunting mini-game.</p>
	
	<p>If you've not played Oregon Trail before, I bet you're wondering how on earth a text-based simulator game can possibly have hunting in it.  Well, It's surprisingly effective what they've gone for.  The hunting sequence goes like this:</p>
	
	<ol>
		<li>Prompt the user to enter the word "bang"</li>
		<li>record their keyboard input and how long it took them to enter it</li>
		<li>A random number is generated, and for hunting to be successful that number must be greater than a "hunting score" that's calculated by how successful the user was at typing "BANG" quickly</li>
		<li>Bullets and food are updated, with better values being given to more successful hunters</li>
	</ol>
	
	<p>My first challenge is capturing the time taken to type "BANG".  I'm doing this Functionally, so I can't include anything with side effects - anything that wouldn't produce the same results any time, so I can't use DateTime.Now.  What to do?  The usual solution to this problem in a Test-Driven Development scenario, is to create a DateTime Service which encapsulates DateTime functions behind an interface that can be injected in.  The interface looks like this:</p>
	
			<pre>
				<code class="cs hljs">
public interface ITimeService
{
	DateTime GetCurrentTime();
}
				</code>
			</pre>
			
	<p>And the implementation like this:</p>
	
			<pre>
				<code class="cs hljs">
public class TimeService : ITimeService
{
	public DateTime GetCurrentTime() => DateTime.Now;
}
				</code>
			</pre>
			
	<p>So, a single-line class nearly, but the point is that I've hidden the side-effect prone function behind an interface, where I can control it.  It means that there's still a function with side effects working in the actual application, but I've pushed it as far away as I can.  It <i>is</i> a compromise, but I can't see what else I'm going to do - I can't <i>not</i> have DateTimes in my code.  This also means I can now write unit tests like this:</p>
	
			<pre>
				<code class="cs hljs">
[Fact]
public void given_the_user_is_hunting_and_they_misspell_bang_in_less_than_7_seconds_then_it_is_treated_as_7_seconds()
{
	var mockTimeService = new Mock&lt;ITimeService&gt;();
	mockTimeService.Setup(x =&gt; x.GetCurrentTime())
		.Returns(new DateTime(1982, 8, 18, 11, 24, 5));

	var mockRnd = new Mock&lt;IGenerateRandomNumbers&gt;();
	mockRnd.Setup(x =&gt; x.BetweenZeroAnd(100)).Returns(91);

	var turnMaker = new TurnMaker(mockTimeService.Object, mockRnd.Object);

	var newTurn = turnMaker.MakeNextTurn(new GameState
	{
		Request = Request.HuntingResult,
		TurnNumber = 2,
		Oxen = 500,
		Food = 250,
		Clothing = 666,
		Ammunition = 750,
		MiscellaneousSupplies = 616,
		DateCounter = 1,
		Money = 50,
		HuntingTimeBegin = new DateTime(1982, 8, 18, 11, 24, 0),
		Fort = false
	}, "BAGN");

	newTurn.Should().BeEquivalentTo(
		new GameState
		{
			IsGameFinished = false,
			Request = Request.HowWellEat,
			Text = new[]
			{
				"SORRY---NO LUCK TODAY",
				string.Empty,
				"DO YOU WANT TO EAT (1) POORLY  (2) MODERATELY OR (3) WELL"
			},
			TurnNumber = 3,
			Oxen = 500,
			Food = 250,
			Clothing = 666,
			Ammunition = 750,
			MiscellaneousSupplies = 616,
			DateCounter = 1,
			Money = 50,
			HuntingTimeBegin = new DateTime(1982, 8, 18, 11, 24, 0),
			MilesTraveled = -45
		}
	);
}
				</code>
			</pre>
			
			
	<p>Notice the random number generator interface there?  Same principe as the DateTime interface, I can't have a real random number generator in my production code, so behind an interface it goes.  I've given it a friendlier set of function names, but behind the scenes, it just looks like this:<p>
	
			<pre>
				<code class="cs hljs">
public class RandomNumberGenerator : IGenerateRandomNumbers
{
	public int BetweenZeroAnd(int to)
	{
		var rnd = new System.Random(DateTime.Now.Millisecond);
		return rnd.Next(0, to);
	}
}
				</code>
			</pre>
			
	<p>The basic idea behind the hunting mini-game is to determine whether or not the user was able to type "BANG" correctly in less than 7 seconds.  There's a Subroutine code block (the nearest that BASIC had to a function) which calculates the time taken which is honestly a little mysterious to me.  This is it:</p>
	
			<pre>
				<code class="basic hljs">
4499  REM ***SHOOTING SUB-ROUTINE***
4500  PRINT "TYPE BANG";
4505  B2=7
4510  C$=""
4515  ENTER #P,B2,B1,C$
4520  PRINT
4525  IF C$="BANG" THEN 4535
4530  B1=7
4535  RETURN
				</code>
			</pre>
			
	<p>I'm not completely sure what the "ENTER" keyword does, but based on how it's used, and some of the commments in the code later, I'd guess that B1 is the time taken to enter "BANG", B2 is the maximum time allowed and c$ is a string that contains the actual user input.  To be able to test this, I can use my DateTime Service and Random Number service iterfaces to force any given scenario I want, and confirm that the appropriate hunting result is applied.  I even separated all of that functionality into an entirely separate Hunting function, so at least it's all grouped together logically.  Like this:</P>
	
			<pre>
				<code class="cs hljs">
private static GameState ResolveHunting(GameState oldState, string userInput, DateTime currentTime, IGenerateRandomNumbers rnd) =>
	((int)(currentTime - oldState.HuntingTimeBegin).TotalSeconds)
	.Map(x =&gt; userInput.ToUpper() == "BANG" ? x : 7 )
	.Map(x =&gt; x &lt; 7 ? x : 7)
	.Map(x =&gt; 
		x == 1 ? oldState with
			{
				Food = oldState.Food + 52 + rnd.BetweenZeroAnd(6),
				Ammunition = oldState.Ammunition - 10 - rnd.BetweenZeroAnd(4),
				Text = new []
				{
					"RIGHT BETWEEN THE EYES---YOU GOT A BIG ONE!!!!",  //TODO: BELLS
				}
			}
		: 
			x * 13 &lt; rnd.BetweenZeroAnd(100)
				? oldState with
				{
					Text = new []
					{
						"NICE SHOT--RIGHT THROUGH THE NECK--FEAST TONIGHT!!"

					},
					Ammunition = oldState.Ammunition - 10 - 3 * (int)x,
					Food = oldState.Food + 48 - 2 * (int)x
				}
				: oldState with
				{
					Text = new[]
					{
						"SORRY---NO LUCK TODAY"
					}
				}
	);
				</code>
			</pre>
			
	<p>There are a couple of things to make not of here.  I'm using a "map" function.  This is an extention method I've added in to allow me to create a list of functions to carry out my iterative changes to state without having to ever change a value.  It also allows me to leave this whole function as an lambda expression.  Think of "map" as being like a Linq "Select" statement, except it operates on the source object as a whole, rather than on each element of an Enumerable.<p>
	
	<p>The bits of logic that are encapsulated above are things like : 
	<ul>
		<li>A "bang" entry time of 1 second is a "flawless victory", and hits automaticlly with extra bonus food.  I can't honestly imagine how that could ever be possible.  Either it literally always was impossible, or the seconds that are being counted in the original BASIC code are longer than actual, real-world seconds.  I might have to experiment with a copy of the game in an emulator to see.</li>		
		<li>A timespan longer than 7 seconds is corrected to 7.  The game doesn't want it to ever be impossible for you to hit</li>		
		<li>The "was it a hit" calculation is the time taken (rounded down to 7) multiplied by 13 (a maximum value of 91), this gives us a score that a random number (chosen between 1 and 100) should be lower than.  This means that longer taken to type, the less likely it is that the player hits their target.  Even if you take forever to type "BANG", the player still has a 9 in 100 change of a hit.</li>
		<li>How many bullets used, and how much food gained is also generated randomly, with the time-taken factor being used to give better results to quick shooters.</li>
		
	</ul>
	
	<p>Another thing to note in the code sample above, I have a TODO comment to include "bells".  The original text written to screen wasn't done in one go, or a block at a time, it was actually printed a character at a time.  Not only that, but there is a type of hidden character that existed from the days of mainframes, and still exists on some terminals, but not others.  The Bell character.  it's represented with the escape sequence \a in some terminals, or in the original BASIC code like this:<p>
	
			<pre>
				<code class="basic hljs">
1752  REM **BELLS IN LINE 1755**
1755  PRINT "RI"'7"GHT BETWEE"'7"N THE EYE"'7"S---YOU GOT A"'7" BIG ONE!!"'7"!!"
				</code>
			</pre>
			
	<p>The Bell characters here are written as "'7".  Each of those would be rendered by making a beep noise, rather than actually writing anything down.  It's an oversight on my part that I didn't write my console output function with single-character-at-a-time or Bells into consideration.  This is a candidate to be re-written on another occasion.  For now I've simply omitted the Bells, and I'll come back and restore them at another time.<p>
	
	<p>That's enough for now.  Come back in a month's time, and I'll aim to have the "horse riders ahead" mini-game and Fort trading done.  That'll be most of the game finished.  I'm planning then to finish off with Part 4, in which I'll finish off the last details, correct any mistakes and omissions, and maybe make a few improvements to the original design.  </p>
	
	<p>Ta-ta for now.  Stay safe until next time.</p>