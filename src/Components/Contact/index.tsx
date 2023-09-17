import react from 'react';

const Contact = () => {
    return (
        <>
            <p>I'm fairly active on social media, and can be reached by any of these means:</p>
            <section className="nes-container with-title is-centered">
                <h3 className='title'>Social Media</h3>
                <div className='item'>
                    <section className="icon-list">
                        <a href="mailto:info@thecodepainter.co.uk" target="_blank" title="email">
                            <i className='nes-icon gmail is-large'></i>
                        </a>  
                        <a href="https://github.com/madSimonJ" target="_blank">
                            <i className="nes-icon github is-large"></i>
                        </a>                        
                        <a href="https://www.linkedin.com/in/simon-painter-45a05217/" target="_blank">
                            <i className="nes-icon linkedin is-large"></i>
                        </a>
                        <a href="https://twitter.com/madSimonJ" target="_blank">
                            <i className="nes-icon twitter is-large"></i>
                        </a>                        
                        <a href="https://www.instagram.com/simon_j_painter/" target="_blank">
                            <i className="nes-icon instagram is-large"></i>
                        </a>
                        <a href="https://www.reddit.com/user/madSimonJ" target="_blank">
                            <i className="nes-icon reddit is-large"></i>
                        </a>                        
                    </section>
                </div>
            </section>
        </>
    );
};

export default Contact;