import react from 'react';



type podcastProps = {
    Podcast: PodcastDetails
}

const Podcast = (props: podcastProps) => {
    return (
        <>
           <p>
                <strong>
                    <a href={props.Podcast.Link}>
                        {props.Podcast.PodcastTitle} #{props.Podcast.Episode}
                    </a>
                </strong>
                 - {props.Podcast.EpisodeTitle} - <small>{new Date(props.Podcast.Date).toLocaleDateString()}</small>
           </p>
        </>
    );
};

export default Podcast;