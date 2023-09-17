import react from 'react';
import talkData from './Talks.json'
import Talk from './Talk';
import _ from 'lodash'

const Talks = () => {
    return (
        <>
            <p>I love talking tech, travelling, meeting new people and making a bit of a fool of myself in public. Speaking at conferences and user groups gives me the perfect opportunity to endulge all of those interests. I come up with new talks all the time, and at any given moment there are usually at least two or three new ones in development, but these are the ones I've finished and have been known to subject members of the public to</p>
            <section className='nes-container with-title'>
                <h3 className='title'>Talks</h3>
                {
                    _.reverse(talkData.Talks).map(x => {
                        
                        return (
                            <Talk Details={x} />
                        );

                    })
                }
            </section>
            
        </>
    );
};

export default Talks;