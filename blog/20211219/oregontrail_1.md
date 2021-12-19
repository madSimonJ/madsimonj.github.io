---
layout: blog
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Functional Programming in C#</h2>
		<h3>Oregon Trail Part One: The Feedback Loop</h3>
		<hr/>
		<div style="text-align: left">	
			<div class="svg-container">
				<img src="Oregontrailsmall.png" width="50%" style="text-align: center" alt="Man sitting with a laptop and phone by a covered wagon">
			</div>

<p>This blog is part of the 2021 C# Advent.  See <a href="https://www.csadvent.christmas/">here for more information</p>

		<h4>Introduction</h4>
		
		<p>Hi, everyone.  I tried starting this blog up a year or so back, but it didn't quite take.  I'm having another go, and to keep me honest, I'm going to focus for now on one of my particular passions in development - functional programming.  Specifically functional programming implemented in C#.  Also drawing, that's been my Covid lockdown project.  I drew the pic at the top on my iPad.  Like it?</p>
		
		<p>This first project of my relaunched blog involves another passion of mine - old computer games (the kinder word is "vintage").  And this time I really do mean <strong>old</strong>.  This particular game dates back to the early 70s.  It was developed on a university mainframe in America in 1971 by three guys that wanted to use it as an educational tool.  It ended up becoming a hit on the university campus, beyond just history students.</P>

		<p>There was another version of the game developed in 1974, based on the original, which was distributed by a Minnesota educational company, but effectively this is a very early example of shareware from the pre-internet days</p>
		
		<p>The game itself is text-based.  There's a simple set-up phase, consisting of deciding how much money to spend, followed by a series of days as the journey along the trail continues.  There are random encounters and the odd mini game.  The player's objective is to survive all the way to the end.</P>
		
		<p>So this little project is a triple-win for me.  It's a challenge, a chance to stretch my functional programming skills, and it's something I might actually be able to play once I'm done.  I might even try and fix a few bugs in the original as I go along</p>
		
		<p>This C# adaptation is based on the BASIC code for the 1974 version released by the Minnesota Educational Computing Consortium, which was re-developed from memories of the (tragically lost to posterity) 1971 university mainframe version.  The code can be found in all sorts of places all over the internet.  I'm hosting a copy myself <a href="oregontrail.bas">here</a>.  I learned to program for the very first time in ZX Spectrum BASIC, so this has been quite a nostalgia trip for me!</p>
		
		<h4>Functional Programming</h4>
		
		<p>Before we start, a couple of notes on the basics of functional programming.  Why am I doing it & what does it involve?</p>
		
		<p>Functional programming has been around since the latest 1800s in some form, and in computing since the 1960s.  This is a rough list of the adventages, it's:</p>
		
		<ul>
			<li>Concise, compact and easy to read</li>
			<li>Robust, and like David Hasselhoff's singing career, nearly impossible to kill once it's in motion</li>
			<li>Super, duper testable - this is the big draw for a lot of people</li>
			<li>a big support if you want to run a ton of concurrent processes or move into containerised microservices</li>
		</ul>
		
		<p>Moving on now, what does it entail:</p>
		
		<ul>
			<li>Once you set a variable, you can't ever change its state (Immutability)</li>
			<li>Functions pass around like variables (as in Funcs)</li>
			<li>No statements like If, When, For, ForEach, any of that stuff.  There're better ways of doing it.</li>
			<li>No state.  Functions only depend on their parameters, and nothing else (at least as much as it's possible to do that) </li>
		</ul>
		
		<p>Now that I've set the ground rules, it's time for us to start building a whole game this way...</p>
		
		<h4>Creating the Input/Output Cycle</h4>
		
		<p>The first bit of code to lay down is the very basic structure of the application itself</p>
		
		<p>When you think about it, a text-based game follows a fairly ridgid pattern: Display text -> Receive user Input -> update state -> Output to user.  And so on, until the game is completed.  We can't change the value of state objects, that's one of our rules, but we can use the super-funky new Record Types in the latest version of C# to easily create a new state object on each iteration, based on the previous one.</p>
		
		<p>If anyone reading this has ever done much with Redux and React, then the functional system of maintaining state might seem familiar.  What you need to do is have a function (or set thereof) which takes the previous state, and a set of instructions as parameters.  It takes these, and determines the new state.  With no state to track, and everything simply being based on the previous operation, it's very easy to come up with unit tests to make sure everything is behavng correctly.</p>
		
		<p>I created an enum to represent the player's progress through the game, so that we know fundamentally where we are.  As well as that, we need a few values that need to be tracked - amount of oxen, amount of ammunition, etc. and the text that the user should see on screen when they receive the new state - which will prompt them with the next intruction.<p>
		
		<p>Here's my actual basic game-loop code:</p>
		
			<pre>
				<code class="cs hljs">
public void StartGame()
{
	var firstState = new GameState();
	var firstTurn = this._turnMaker.MakeNextTurn(firstState, string.Empty);
	this._textDisplay.DisplayToUser(firstTurn.Text);

	firstTurn.IterateUntil(
			x =&gt;
			{
				var input = this._userInputCapture.GetInput();
				var nextTurn = this._turnMaker.MakeNextTurn(x, input);
				this._textDisplay.DisplayToUser(nextTurn.Text);
				
				return nextTurn;
			},
			x =&gt; x.IsGameFinished
		);
}
				</code>
			</pre>
			
			<p>Most of what this code is doing is pretty self-explanatory.  It's initiating an initial game state, feeding that into something that make a turn (i.e. advances the game world 1 move) and displays the results of that to the user.  We then iterate until the game is finished with that same basic process.  Capture input, update state, display to user.</p>
			
			<p>You may notice however, the "IterateUntil" function in this code extract.  That's not part of C#.  That's here because there's an entirely indeterminate amount of stuff that has to happen between starting the game, and the turn on which it ends.  If I were writing normal code, I'd probably use a while(true) with a "break" statement somewhere to kill the process once we're ready, but I'm being functional.  I cobbled together a quick, generic extension method to provide that same functionality for me here:</p>
			
			<pre>
				<code class="cs hljs">
public static T IterateUntil&lt;T&gt;(
	this T @this,
	Func&lt;T, T&gt; createNext,
	Func&lt;T, bool&gt; finishCondition)
{
	var isFinished = finishCondition(@this);
	if (isFinished)
	{
		return @this;
	}
	else
	{
		return IterateUntil(
				createNext(@this),
				createNext,
				finishCondition);
			
	}
}
				</code>
			</pre>
			
	<p>This isn't perfect, as we're recursing, possibly for a very long time.  That can have a memory impact, since we're effectively holding all of those iterations in memory until the process completes.  Pure functional languages support Tail Recursion, which avoids that problem, but that's not a luxury we can necessarily have available to us in C#.  I'll be returning to this topic in a future article, so watch this space.  There are a couple of ways of getting what we want, but it's worth writing an entire article about.</p>
	
	<p>This is our game state at this point.  Mostly storing how many turns there have been, the current text to display, and a few values that need tracking - like how much ammo we have so far.</P>
	
			<pre>
				<code class="cs hljs">
public enum Request
{
	StartGame = 0,
	DoYouRequireInstruction = 1,
	HowMuchSpendOnOxen,
	HowMuchSpendOnFood,
	HowMuchSpendOnAmmunition,
	HowMuchSpendOnClothing,
	HowMuchSpendOnMisc,
	BeginGame
}
public record GameState
{
	public int TurnNumber { get; set; } = 1;
	public bool IsGameFinished { get; set; }
	public IEnumerable<string&gt; Text { get; set; } = Enumerable.Empty<string&gt;();
	public Request Request { get; set; }
	public int Food { get; set; }
	public int Oxen { get; set; }
	public int Ammunition { get; set; }
	public int MiscelaneousSupplies { get; set; }
	public int Clothing { get; set; }
	public int Money { get; set; }
}
				</code>
			</pre>
			
	<p>This bulk of the code I've written, however, is the engine for generating new states whenever we turn over.  That makes use of one of my favourite features in C# in recent years - switch operations.  This is basically a C# inplementation of a functional concept called Pattern Recognition.  I use the switch operation to determine the current in-game operation being performed, as well as whatever validation operations need to be applied - like has the user over-spent, or entered a number that's below 0 for something.  Part of the system for setting state is setting the next in-game operation to be performed, so I can set the player back to a previous part of the game if a validation process fails.  The original code used those infamous BASIC "goto" commands to literally skip forward or backward to repeat or skip validation messages, but there's no chance I'd do that, even if I could.  In any case, there's something about the stateless simplicity of maintaining a Switch operation that appeals to be an awful lot.</p>
	
	<p>Chances are, as this project continues, and the switch operation grows significantly in size, then I'm going to have to split it out into sub-functions, or sub-classes to hold all of the additional possible state transitions.  One of my pet haates in development though, is coding for a requirement we aren't considering yet, so let's stay on track.</p>
	
	<p>Here are a few examples of my state transitions:</p>
	
	
			<pre>
				<code class="cs hljs">
Request.HowMuchSpendOnClothing when userInputAsInt < 0 =&gt; state with
{
	Request = Request.HowMuchSpendOnClothing,
	Text = new[]
	{
		"IMPOSSIBLE",
		string.Empty,
		string.Empty,
		"HOW MUCH DO YOU WANT TO SPEND ON CLOTHING"
	}
},
Request.HowMuchSpendOnClothing =&gt; state with
{
	Clothing = userInputAsInt,
	Request = Request.HowMuchSpendOnMisc,
	Text = new[]
	{
		"HOW MUCH DO YOU WANT TO SPEND ON MISCELANEOUS SUPPLIES"
	}
},
				</code>
			</pre>
	
	<p>Here I'm checking on how much the user spent on clothes.  If the value was negative - i.e. less than 0, then it's invalid and the player needs to move back a step.  Otherwise, we store up the value and move on to the next operation.</p>
	
	<p>A consequence of moving to the state-transition approach, rather than the line-jumping BASIC approach of this original is that I end up needing to replicate some state messages, as they are there to prompt the user to enter the required data, and that happens now in 2 places: the original prompt, and the re-try prompt if they fail validation.  I can live with that, but I'm not going to pretend that I won't be trying to think of some way to make it a little more concise.</p>
	
	<p>In case you're curious, the state variables being stored so far are all about the amount of money (in Dollars) spent on each of the following:</p>
	
	<ul>
		<li>Food</li>
		<li>Oxen</li>
		<li>Ammunition</li>
		<li>Miscellaneous Supplies</li>
		<li>Clothing</li>
	</ul>
	
	<p>Naturally, we are also tracking the remaining money.  There are trading posts along the trail, which the player will have the option to buy new items at.  The final state transition for this setup phase of the game consists of a check that the player hasn't over-spent.  If they have, they're returned to the beginning of setup to try again:</p>			
	
	<pre>
				<code class="cs hljs">
				
				
Request.HowMuchSpendOnMisc =&gt; state with
{
	Request = Request.BeginGame,
	MiscellaneousSupplies = userInputAsInt,
	Money = 700 - (state.Ammunition + state.Food + userInputAsInt + state.Oxen + state.Clothing),
	Text = new[]
	{
		$"AFTER ALL YOUR PURCHASES, YOU NOW HAVE {700 - (state.Ammunition + state.Food + userInputAsInt + state.Oxen + state.Clothing)} DOLLARS LEFT",
		string.Empty,
		"MONDAY MARCH 29 1847"
	}
}
	
	</code>
</pre>

		<h4>Improvements</h4>
		
		<p>It would be nice to think I could fix some bugs and make some improvements on the original as I carry out this project.  Nothing drastic, I'm still effectively creating a port of the original code, as close to the feel of it as I can.  Still I can't help finding the odd issue to fix.</p>
		
		<p>So far that mostly consists of ensuring case sensitivity isn't a thing - since that's easily done in C#, and expanding the range of accepted commands.  The first prompt to the player in the original code was to ask whether instructions were required.  Any answer other than "yes" would result in no instructions being displayed.  I added in an "isYes" function to expand the range of responses:</p>
		
	<pre>
				<code class="cs hljs">
				
        private static bool IsYes(string s) =&gt;
            new[]
            {
                "y",
                "yes"
            }.Contains(s.ToLower());
				</code>
	</pre>
		
		<p>Nothing flashy, but it might the game experience a tiny bit better</p>
		
		<p>The one area I'm debating seriously whether to change is to provide an awful lot more information to the player during the questions regarding how much to spend.  In the original, you simply got a series of questions, and were only required to provide positive numeric values to pass validation in most cases.  It was only after the fifth question you'd finally find out whether you'd gone over budget or not.  It also wasn't possible to move back a step, to change your mind on a previous answer. </p>
		
		<p>This feels like a step far too far for this first iteration of the project.  I still fundamentally want it to have the same look and feel as the 1974 original, but it wouldn't be all that hard to do, considering how much easier it would make those first few steps.</p>
		
		<p>I think I'll most likely loop back around at the end to create a version 1.5, exclusive to the C# port, which fixes a lot of the UX issues the original had.</p>

		<h4>Testing</h4>
	
	<p>I'll wrap up with a quick look at testing for this project.  The stateless approach I'm using makes unit testing extremely easy.  I simply create a state which is exactly at the point I want, and the user input I'm testing, then confirm that the expected new state is returned.  Simple as that.  Here's an example, in which I'm using XUnit and FluentAssertions (one of my favourite Nuget packages ever):
	
	<pre>
				<code class="cs hljs">
	
[Fact]
public void given_the_user_enters_an_oxen_price_too_high_then_the_user_is_prompted_to_try_again()
{
	var turnMaker = new TurnMaker();

	var newTurn = turnMaker.MakeNextTurn(new GameState
	{
		Request = Request.HowMuchSpendOnOxen,
		TurnNumber = 2
	}, "500");

	newTurn.Should().BeEquivalentTo(
		new GameState
		{
			IsGameFinished = false,
			Request = Request.HowMuchSpendOnOxen,
			Text = new[]
			{
				"TOO MUCH",
				string.Empty,
				string.Empty,
				"HOW MUCH DO YOU WANT TO SPEND ON YOUR OXEN TEAM"
			},
			TurnNumber = 3
		}
	);
}
	
	</code>
</pre>

<p>This particular test is checking that if the user is prompted for a spend on Oxen, and they said an amount that's drastically too high, then they're told it's too much and returned to the system state that will prompt them for a spend on oxen.  All of the tests in my suite so far follow this style.  I'm hoping the rest of the system will be as easy.</p>
	
<h4>To follow...</h4>

<p>The next step is to write out the basic turn sequence (each turn consisting of a set number of days in world time, during which there will be random events and activities for the user to perform.  Unless there are any surprises, I'll probably leave out mini-games for the time being, and focus on those in a subsequent installment.  The real-time hunting game sounds especially challenging to do this way.</p>

<p>My current plan is to have a blog entry a month written during 2022, and for the most part I'm intending to stick to the same format - fun retro computing projects in Functional C#.  Tentatively the next game I'd like to look at is Dope Wars, which has a similar age and pedigree to Oregon Trail.  I hope you'll stay with me for all of that as well.</p>

<p>Thanks for reading!  Stay safe out there!</p> 

