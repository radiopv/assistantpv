import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageList } from "@/components/Messages/MessageList";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Gift, 
  Search,
  List,
  User
} from "lucide-react";
import Login from "@/pages/auth/Login";

const Index = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">
            Passion Varadero
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mb-8">
            <Link to="/children">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Search className="h-6 w-6" />
                {t('searchChildren')}
              </Button>
            </Link>
            <Link to="/become-sponsor">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Heart className="h-6 w-6" />
                {t('becomeSponsor')}
              </Button>
            </Link>
            <Link to="/donations">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Gift className="h-6 w-6" />
                {t('viewDonations')}
              </Button>
            </Link>
          </div>
          <Login />
        </div>
      </div>
    );
  }

  if (user.role === 'admin' || user.role === 'assistant') {
    return <Navigate to="/dashboard" />;
  }

  // For sponsors and regular users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          {t('welcome')} {user.name}
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mb-8">
          {user.role === 'sponsor' ? (
            <>
              <Link to="/sponsored-children">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <List className="h-6 w-6" />
                  {t('mySponsoredChildren')}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <User className="h-6 w-6" />
                  {t('myProfile')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/children">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Search className="h-6 w-6" />
                  {t('searchChildren')}
                </Button>
              </Link>
              <Link to="/become-sponsor">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Heart className="h-6 w-6" />
                  {t('becomeSponsor')}
                </Button>
              </Link>
            </>
          )}
          <Link to="/donations">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Gift className="h-6 w-6" />
              {t('viewDonations')}
            </Button>
          </Link>
        </div>
        
        {user.role === 'sponsor' && (
          <Card className="max-w-4xl mx-auto">
            <div className="p-4">
              <MessageList onSelectMessage={() => {}} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;