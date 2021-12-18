---
layout: blog
---

<div class="pagepanel down_arrow white">
  <div class="center">
		<h2>Functional Programming in C#</h2>
		<h3>Oregon Trail Part One: The Feedback Loop</h3>
		<hr/>
		<div tyle="text-align: left">	
			<div class="svg-container">
				<img src="Oregontrailsmall.png" width="50%" style="text-align: center" alt="Man sitting with a laptop and phone by a covered wagon">
			</div>

		<p/>
		
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
			<li>Functions pass around like variables (as in Func<T>)</li>
			<li>No statements like If, When, For, ForEach, any of that stuff.  There're better ways of doing it.</li>
			<li>No state.  Functions only depend on their parameters, and nothing else (at least as much as it's possible to do that)</li>
		</ul>
		
		<p>Now that I've set the ground rules, it's time for us to start building a whole game this way...</p>
		
		<h4>Creating the Input/Output Cycle</p>
		
		<p>Some text</p>