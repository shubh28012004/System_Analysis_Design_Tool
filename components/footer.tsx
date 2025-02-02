import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const lastUpdated = "2025-01-30" // You might want to automate this
  const version = "1.0.0" // You might want to automate this

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">WebApplication Created by Team Symbiosis</p>
            <p className="text-xs text-muted-foreground mt-1">
              Version {version} | Last Updated: {lastUpdated}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
          <div className="flex space-x-4">
            <a href="mailto:support@example.com" className="text-sm text-muted-foreground hover:text-primary">
              Contact Support
            </a>
            <a
              href="https://twitter.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com/company/example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Advanced Structural Analysis & Design Tool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

