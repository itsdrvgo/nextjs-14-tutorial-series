export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <h1>Company</h1>
            {children}
        </div>
    );
}
