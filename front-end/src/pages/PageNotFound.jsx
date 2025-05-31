import confused from "../images/confusedBear.png"
import mountains from "../images/mountains.png"

const PageNotFound = () => {

    return (
        <main>
            <div className="page-not-found">
                <h1>
                    <img src={confused} alt="cartoon image of a confused bear shrugging"/> 404 ERROR <img src={confused} alt="cartoon image of a confused bear shrugging"/>
                </h1>
                <h2>I can't find that page!  Sorry!</h2>
                <img src={mountains} alt="Clipart of a mountain range"/>
            </div>

        </main>
    );
};

export default PageNotFound