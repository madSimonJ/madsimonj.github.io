import react from 'react';
import podcastData from './podcasts.json';
import Podcast from './Podcast';

const Podcasts = () => {
    return (
        <>
            <p>As of {new Date().getFullYear()}, I've been lucky enough to end up on a episodes of some of the absolutely brilliant .NET and tech podcasts that are out there on your favourite podcast client. Thanks to everyone involved for these!</p>
            <div className="nes-container with-title is-centered">
                <h3 className='title'>Podcast List</h3>
                {
                    podcastData.Podcasts.map(x => {
                        return (
                            <Podcast Podcast={x} />
                        );
                    } )
                }
            </div>
        </>
    );
};

export default Podcasts;