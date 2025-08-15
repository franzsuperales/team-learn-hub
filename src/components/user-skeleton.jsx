// components/UserSkeleton.jsx
export default function UserSkeleton() {
    return (
        <div className="animate-pulse flex items-center gap-3">
        <div className="flex flex-col gap-1 items-end">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-3 w-36 bg-muted rounded" />
        </div>
        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>      
    );
  }
  