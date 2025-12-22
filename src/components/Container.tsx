type ContainerProps = {
    className?: string;
    children: React.ReactNode;
};

export default function Container({ className = "", children }: ContainerProps) {
    return (
        <div className={`mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 ${className}`}>
            {children}
        </div>
    );
}
