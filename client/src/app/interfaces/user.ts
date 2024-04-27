export interface User {//F12
    _id: string;
    username: string;
    email: string;
    password: string;
    img: {
      data: {
        data: Node
      }
    };
    trip: string[];
    __v: number;
  }