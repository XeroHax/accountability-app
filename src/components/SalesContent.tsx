import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function SalesContent() {
  return (
    <div className="sales-content-section max-w-4xl mx-auto space-y-10 bg-background rounded-b-xl shadow-md px-8 pb-8 mb-16">
      {/* Dream Section */}
      <section className="bg-accent/5 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row md:gap-8 items-center">
          <div className="md:w-1/3 mb-6 md:mb-0 pt-6 md:pt-0 order-last md:order-first">
            <Image
              src="/frenchie-playing-guitar.png"
              alt="French Bulldog playing guitar"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-2/3 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              How crazy would life be if we simply stuck to our goals?
            </h2>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>We&apos;d see our name on that best-selling book.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>Friends would ask—no, beg—for our ab routine.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>
                  The dentist would gasp at how marvellous our gums are.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>
                  We&apos;d speak French in Paris, and the Parisians would give
                  us a locals-only discount.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>
                  We&apos;d rock the hell out of a Fender custom shop
                  Stratocaster guitar in front of thirty thousand people singing
                  along.
                </span>
              </li>
            </ul>
            <p className="text-xl font-medium">Amazing, right?</p>
          </div>
        </div>
      </section>

      {/* Reality Section */}
      <section className="space-y-6 py-6 px-8 rounded-xl">
        <h2 className="text-3xl font-bold tracking-tight">
          But that&apos;s not what happens.
        </h2>
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="md:w-3/5 space-y-4 text-lg">
            <p>
              We start writing the book, but we stall, and every new bestseller
              we see feels like salt in the wound.
            </p>
            <p>
              We ate well for a bit, trained hard, and kept paying for that gym
              membership, but our vibes tanked when we saw our fit
              coworker&apos;s beach vacation pics.
            </p>
            <p>
              The dentist gives the flossing lecture again. We nod, we promise,
              we mean it this time (really!), but six months later, there&apos;s
              the lecture again.
            </p>
            <p>
              In Paris, our French collapses in seconds, and the waiter switches
              to English, complete with a sneer.
            </p>
            <p>
              We played that starter guitar for a month, and every time we moved
              it to sweep the floor, our inner rockstar died just a little bit,
              so we put it in the closet.
            </p>
          </div>
          <div className="md:w-2/5 flex items-center justify-center mt-6 md:mt-0">
            <Image
              src="/sad-dog.png"
              alt="Sad dog representing disappointment"
              width={300}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Failed Solutions Section */}
      <section className="space-y-6 bg-accent/5 p-8 rounded-xl">
        <h2 className="text-3xl font-bold tracking-tight">
          The solution is simple: we just need to stick to our goals!
        </h2>
        <div className="space-y-4 text-lg">
          <p>
            We download the tracker apps, get an accountability buddy, block
            time on our calendar, and set the alarm for an early start. This is
            it! This time, we&apos;re going to crush it.
          </p>
          <p>
            Except we don&apos;t. The app reminders become background noise.
            Accountability partners disappear. Alarms get snoozed (repeatedly),
            and our carefully scheduled calendar blocks turn into wishful
            thinking.
          </p>
          <p>
            We chase the next shiny thing again and again. Why is this so hard?!
            We show up for work when we don&apos;t want to, so why can&apos;t we
            show up for ourselves?
          </p>
          <p className="font-medium">
            Simple. Because when we skip work, there are real consequences.
          </p>
        </div>
      </section>

      {/* Expensive Solution Section */}
      <section className="space-y-6 py-6 px-8 rounded-xl">
        <h2 className="text-3xl font-bold tracking-tight">
          We then decide we need skin in the game!
        </h2>
        <div className="space-y-4 text-lg">
          <p>
            And to keep us accountable, we hire a coach even when we don&apos;t
            need it.
          </p>
          <p>
            For those who can afford to hire a coach, things go well, but it
            sure is expensive. A good coach can cost as much as a luxury car. A
            trainer can charge more than $100 a session, for example.
          </p>
          <p>
            If they coach us every session, five times a week, that&apos;s
            $24,000 a year.
          </p>
          <p className="text-xl font-semibold">
            What if you could get all the accountability you need, and instead
            of $24,000 a year, it cost you nearly nothing?
          </p>
        </div>
      </section>

      {/* Product Introduction Section */}
      <section className="space-y-6 bg-accent/5 p-8 rounded-xl">
        <h2 className="text-4xl font-bold tracking-tight text-center">
          Introducing Accountability Place
        </h2>
        <p className="text-xl text-center">
          It&apos;s simple, fun, and incredibly effective. You decide what to
          pay, and when you follow through, you get rewarded.
        </p>

        <div className="md:grid md:grid-cols-3 md:gap-8 pt-4">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold mb-4">
              Here&apos;s how it works:
            </h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>
                  You set your goals and pick the tasks you&apos;ll stay
                  accountable for—things that matter to you.
                </span>
              </li>

              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>
                  You will be in a small accountability group, up to five
                  people. Enough people to reliably be there for you, but not so
                  large that you get lost in the chaos.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">•</span>
                <span>
                  Each day, using the app, you will do your tasks, check them
                  off, and check in with your group via the messenger feature.
                  You&apos;ll cheer each other on and support each other. The
                  people really make it special.
                </span>
              </li>
            </ul>
          </div>

          <div className="hidden md:flex md:col-span-1 items-start justify-center">
            <Image
              src="/happy-dog-sideways.png"
              alt="Happy dog representing success"
              width={300}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <ul className="mt-8 space-y-4 text-lg">
          <li className="flex items-start">
            <span className="mr-2 text-xl">•</span>
            <span>
              Every time you complete a task, you earn credit toward the next
              month&apos;s subscription. Did 15 out of 30 tasks? Your next month
              is 50% off. Crushed all 30 tasks?{" "}
              <span className="font-bold">
                Your next month is on the house.
              </span>
            </span>
          </li>
          <h3 className="text-2xl font-semibold mt-4 mb-2">You pick the price!</h3>
          <li className="flex items-start">
            <span className="mr-2 text-xl">•</span>
            This is an important key. Ask yourself, how much skin in the game
            will keep you motivated? There is a minimum, but you choose the
            price that will motivate.
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-xl">•</span>
            <span>
              It&apos;s accountability, gamified. Your wins earn you real
              savings, and the motivation to keep going builds momentum toward
              your goals.
            </span>
          </li>
        </ul>

        <div className="md:hidden flex justify-center mt-6">
          <Image
            src="/happy-dog-sideways.png"
            alt="Happy dog representing success"
            width={300}
            height={300}
            className="w-full max-w-xs h-auto rounded-lg"
          />
        </div>

        <p className="text-xl font-semibold pt-4">
          Finally, accountability that makes achieving your goals addictive.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-6 px-8 rounded-xl">
        <h2 className="text-3xl font-bold">Ready to play for keeps?</h2>
        <div className="flex justify-center pt-4">
          <Link href="/signup">
            <Button size="lg" className="text-lg font-semibold px-12 py-6">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
