interface User {
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
}

export function DataTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">用户</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">角色</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">状态</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">最后登录</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email} className="border-b border-border/50 hover:bg-muted/50">
              <td className="py-3 px-2">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </td>
              <td className="py-3 px-2">
                <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-2">
                <span className={`inline-flex items-center gap-1 text-xs ${user.status === "活跃" ? "text-green-600" : "text-muted-foreground"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === "活跃" ? "bg-green-600" : "bg-muted-foreground"}`} />
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-2 text-muted-foreground">{user.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
