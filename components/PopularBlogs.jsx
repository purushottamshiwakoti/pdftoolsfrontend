import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const PopularBlogs = () => {
  return (
    <div>
      <Card className="w-[23rem]">
        <CardHeader>
          <CardTitle>Popular Blogs</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-4">
              <Image
                src={"/img/blog.jpg"}
                alt="blog"
                width={300}
                height={300}
              />
              <div>
                <h2 className="font-bold text-black/80 line-clamp-1">
                  Blog Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Commodi voluptatibus consequatur omnis aut minus culpa est
                  impedit distinctio ad alias.
                </h2>
                <p className="line-clamp-2 text-gray-600">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Consectetur dignissimos facilis ex voluptatibus. Ratione quae
                  repellat vel ad doloribus eveniet quisquam ullam et assumenda
                  quibusdam, voluptatibus labore eum esse laudantium eos
                  consequatur unde accusamus iste voluptatem. Veniam asperiores
                  sapiente fugit!
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Image
                src={"/img/blog.jpg"}
                alt="blog"
                width={300}
                height={300}
              />
              <div>
                <h2 className="font-bold text-black/80 line-clamp-1">
                  Blog Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Commodi voluptatibus consequatur omnis aut minus culpa est
                  impedit distinctio ad alias.
                </h2>
                <p className="line-clamp-2 text-gray-600">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Consectetur dignissimos facilis ex voluptatibus. Ratione quae
                  repellat vel ad doloribus eveniet quisquam ullam et assumenda
                  quibusdam, voluptatibus labore eum esse laudantium eos
                  consequatur unde accusamus iste voluptatem. Veniam asperiores
                  sapiente fugit!
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Image
                src={"/img/blog.jpg"}
                alt="blog"
                width={300}
                height={300}
              />
              <div>
                <h2 className="font-bold text-black/80 line-clamp-1">
                  Blog Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Commodi voluptatibus consequatur omnis aut minus culpa est
                  impedit distinctio ad alias.
                </h2>
                <p className="line-clamp-2 text-gray-600">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Consectetur dignissimos facilis ex voluptatibus. Ratione quae
                  repellat vel ad doloribus eveniet quisquam ullam et assumenda
                  quibusdam, voluptatibus labore eum esse laudantium eos
                  consequatur unde accusamus iste voluptatem. Veniam asperiores
                  sapiente fugit!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopularBlogs;
