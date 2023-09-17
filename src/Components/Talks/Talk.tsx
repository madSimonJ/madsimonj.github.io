import react from 'react';

type talkProps = {
    Details: TalkDetails
}

const Talk = (props: talkProps) => {
    return (
        <>
            
            <div>
                <section className='nes-container with-title is-centered'>
                    <p className='title'>{props.Details.Title}</p>
                    <img src={props.Details.Image} />
                    <p>{props.Details.Description}</p>
                </section>
            </div>

        </>
    );
};

export default Talk;