export default function userProfile({params} : any) {
    return (
        <div className="p-5">
            <h1 className="text-center text-3xl font-bold rounded-2xl bg-green-200 text-green-500 p-5">
                User Profile <i className="text-black underline"><code>{params.id}</code></i>
            </h1>
        </div>
    );
}