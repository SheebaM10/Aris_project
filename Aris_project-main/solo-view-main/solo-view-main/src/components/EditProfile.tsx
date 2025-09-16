import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface EditProfileProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Profile) => void;
}

export const EditProfile = ({ profile, onClose, onSave }: EditProfileProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    department: profile.department || "",
    role: profile.role || "",
    location: profile.location || "",
    availability: profile.availability || "",
    experience: profile.experience || "",
    phone: profile.phone || "",
    current_projects: profile.current_projects || [],
    completed_projects: profile.completed_projects || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          department: formData.department || null,
          role: formData.role || null,
          location: formData.location || null,
          availability: formData.availability || null,
          experience: formData.experience || null,
          phone: formData.phone || null,
          current_projects: formData.current_projects.length > 0 ? formData.current_projects : null,
          completed_projects: formData.completed_projects.length > 0 ? formData.completed_projects : null,
        })
        .eq("id", profile.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      onSave(data);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = (type: 'current_projects' | 'completed_projects') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeProject = (type: 'current_projects' | 'completed_projects', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateProject = (type: 'current_projects' | 'completed_projects', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((project, i) => i === index ? value : project)
    }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  placeholder="e.g., Full-time, Part-time"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Describe your experience and skills..."
                rows={3}
              />
            </div>

            {/* Current Projects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Current Projects</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addProject('current_projects')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {formData.current_projects.map((project, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={project}
                    onChange={(e) => updateProject('current_projects', index, e.target.value)}
                    placeholder="Project name"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject('current_projects', index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Completed Projects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Completed Projects</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addProject('completed_projects')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {formData.completed_projects.map((project, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={project}
                    onChange={(e) => updateProject('completed_projects', index, e.target.value)}
                    placeholder="Project name"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject('completed_projects', index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};