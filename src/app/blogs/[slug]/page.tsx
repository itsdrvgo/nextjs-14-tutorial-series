interface PageProps {
    params: {
        slug: string;
    };
}

export default function Page({ params }: PageProps) {
    const { slug } = params;

    return <div>Viewing Blog: {slug}</div>;
}
