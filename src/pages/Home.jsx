import Banner from "../components/ui/Banner.jsx";

function HomePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center py-8">Home Page</h1>
            <Banner
                title="lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
                text="lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
                image="https://via.placeholder.com/150"
                buttonText="lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            />
        </div>
    );
}

export default HomePage;
