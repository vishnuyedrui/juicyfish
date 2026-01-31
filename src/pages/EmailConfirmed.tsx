import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, CheckCircle, Mail } from 'lucide-react';

const EmailConfirmed = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">Smart Attendance</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
            <CardDescription>
              Your account is now verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center relative">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Welcome to JuicyFish!</h3>
                <p className="text-sm text-muted-foreground">
                  Your email has been successfully verified. You can now sign in to access all features of the Smart Attendance Management System.
                </p>
              </div>

              <div className="space-y-3">
                <Link to="/auth">
                  <Button className="w-full">Continue to Sign In</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Explore Grade Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmailConfirmed;
