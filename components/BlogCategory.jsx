import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BlogCategory = () => {
  return (
    <div>
      <Card className="w-[23rem]">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <p>Card Content</p>
              <Separator className="mt-2" />
            </div>
            <div>
              <p>Card Content</p>
              <Separator className="mt-2" />
            </div>
            <div>
              <p>Card Content</p>
              <Separator className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCategory;
