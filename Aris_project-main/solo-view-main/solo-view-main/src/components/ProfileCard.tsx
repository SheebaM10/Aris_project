import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, MapPin, Clock, Briefcase, Award } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  department: string | null;
  role: string | null;
  location: string | null;
  availability: string | null;
  experience: string | null;
  phone: string | null;
  current_projects: string[] | null;
  completed_projects: string[] | null;
}

interface ProfileCardProps {
  profile: Profile;
  onEdit: () => void;
}

export const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
          <p className="text-muted-foreground">{profile.role || "No role specified"}</p>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}
          {profile.availability && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{profile.availability}</span>
            </div>
          )}
        </div>

        {/* Department and Experience */}
        <div className="space-y-4">
          {profile.department && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Department
              </h3>
              <Badge variant="secondary">{profile.department}</Badge>
            </div>
          )}
          
          {profile.experience && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Experience
              </h3>
              <p className="text-sm text-muted-foreground">{profile.experience}</p>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {profile.current_projects && profile.current_projects.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Current Projects</h3>
              <div className="flex flex-wrap gap-2">
                {profile.current_projects.map((project, index) => (
                  <Badge key={index} variant="default">
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.completed_projects && profile.completed_projects.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Completed Projects</h3>
              <div className="flex flex-wrap gap-2">
                {profile.completed_projects.map((project, index) => (
                  <Badge key={index} variant="outline">
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};