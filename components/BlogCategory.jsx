import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BlogCategory = ({ categoriesData }) => {
  const searchParams = useSearchParams();
  const searchedCategory = searchParams.get("category");
  return (
    <div className="">
      <Card className="lg:w-[20rem]">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoriesData.map((item) => (
              <div key={item.id}>
                <Button
                  variant={
                    searchedCategory == item.name ? "primary" : "outline"
                  }
                  className="w-full flex items-start justify-start"
                  asChild
                >
                  <Link
                    href={{
                      pathname: "/blogs",
                      query: { category: item.name },
                    }}
                    scroll={false}
                  >
                    {item.name}
                  </Link>
                </Button>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCategory;
