import react from 'react';
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from 'react-router-bootstrap'
import portrait from './portrait.png';

const About = () => {
    return (
        <>
            <div className="nes-container with-title is-centered">
                <p className='title'>About Me</p>
                <img src={portrait} alt="Me if I were in a ZX Spectrum Game!" width="100%"/>                
                <br />
                <br />
                <p>Hi!  My name is Simon Painter and I code both professionally and - since it's also my hobby - for fun as well.  I live in a small town in the West Midlands, not far from the Welsh Border, along with my lovely wife and two small children.</p>
                <p>I've been coding professionally since I graduated from university in 2005, and for a hobbby since I was old enough to read my Dad's ZX Spectrum BASIC manual.  I used to love those Usbourne books which were full of source code, accompanied by flashy 80s-tastic oil paintings of spaceships and monsters, as well as the accompanying source code for a game that, once entered into the machine, was somewhat less visually impressive.</p>
                <p>I work predominently in C# and ASP.NET, but I've also worked a lot with NodeJS, JavaScript (ES5 and ES6+), VB6, VB.NET, ASP Classic and a host of other technologies.  In all honesty I'm happy working with anything, so long as there's plenty of work to do.</p>
                <p>I'm at my happiest with a mug of coffee, a pair of headphones playing some sort of strange music that only I seem to like, and a realy tough code problem to ponder.  Possibly with a few sheets of blank paper to make notes on</p>
                <p>Aside from coding, I'm a fairly keen amateur musician (my enthusiasm probably far outstretches my ability, however) and can often be heard torturing my wife and kids with the aid of a guitar, flute, or some other instrument.  </p>
                <p>My other interests include Doctor Who, Fighting Fantasy Gamebooks and drinking rather more cofee than is probably healthy for me!</p>
                <p>If you're interested in offering me a contract, or you have a question following one of my talks, or you just want to chat, check out my <LinkContainer to="/Contact">
                                <Nav.Link className='nes-btn is-primary'>Contact Me</Nav.Link>
                            </LinkContainer> page.</p>
            </div>
        </>
    );
};

export default About;