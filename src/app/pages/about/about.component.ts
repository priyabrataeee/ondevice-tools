import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import {
  DONATION_URL,
  EMAIL,
  LICENSE_NAME,
  SITE_AUTHOR,
  SITE_FOUNDED,
  SOURCE_URL,
} from '../../core/site.config';
import { ToolService } from '../../core/tool.service';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <h1 class="text-3xl font-bold tracking-tight md:text-4xl">About OnDevice Tools</h1>
      <p class="mt-3 text-lg text-muted">
        {{ toolCount }} everyday utilities that process files and text inside your browser tab,
        without a tool-processing backend.
      </p>

      <div class="prose-qt mt-8">
        <h2>Why this site exists</h2>
        <p>
          Some online utilities upload files for processing. Others work locally. It can be
          difficult to tell which you are using before choosing a file. This project makes its
          processing code public so you can inspect that choice and understand each tool's limits.
        </p>
        <p>
          OnDevice Tools was built to remove that decision. Every tool here is written in
          JavaScript that runs on your own machine. Your file is read by the browser, processed by
          the browser, and handed back by the browser. There is no upload step to opt out of,
          in the tool-processing code. The public website still connects to its CDN, analytics
          and advertising providers; local processing is not a guarantee against every privacy risk.
        </p>

        <h2>How it actually works</h2>
        <p>
          The site is a static build. Each of the {{ toolCount }} tools is prerendered to plain
          HTML at build time and served as a file from a CDN — the same way an image is served.
          When you open a tool, the browser downloads a small JavaScript bundle for that one tool
          and runs it locally.
        </p>
        <p>
          The heavy lifting uses capabilities browsers already ship: the Canvas API for image
          compression and resizing, the File API for reading files you choose, Web Crypto for
          hashing, pdf-lib for the PDF tools, and the built-in JSON and text parsers for the
          developer tools. Nothing about that pipeline involves a network request.
        </p>
        <p>
          A service worker caches application resources for offline use. Open the tools you need
          and test them offline before relying on them without a connection. Downloads can fail,
          storage can be cleared, and a first visit does not guarantee a complete cache.
        </p>

        <h2>What this means in practice</h2>
        <ul>
          <li><strong>No processing upload.</strong> Speed depends on your device and input size.</li>
          <li>
            <strong>Use non-sensitive samples.</strong> Do not paste live credentials or regulated
            data into a public website solely because it processes inputs locally.
          </li>
          <li>
            <strong>Limits are tool-specific.</strong> Some tools cap input size or execution time
            to protect responsiveness; device memory also matters.
          </li>
          <li><strong>It works offline</strong> once cached, including on a plane or a train.</li>
          <li><strong>There is no account.</strong> Nothing to sign up for, nothing to cancel.</li>
        </ul>

        <h2>Who builds it</h2>
        <p>
          OnDevice Tools is built and maintained by {{ author }}, an independent developer. It
          started in {{ founded }} as a handful of tools that solved problems I kept hitting, and
          grew as I got tired of pasting things into sites I did not trust.
        </p>
        <p>
          It is a one-person project, which is why tools ship steadily rather than all at once,
          and why the feedback loop is short: if something is wrong, mail
          <a [href]="'mailto:' + email.support">{{ email.support }}</a> with a non-sensitive example
          and your browser version. Response and repair times are not guaranteed.
        </p>

        <h2>How it is paid for</h2>
        <p>
          Serving static files from a CDN costs very little, which is the main reason this can be
          free without an account or subscription. Donations support the project; advertising is
          configured but whether ads appear depends on provider approval and visitor settings.
          Our tool code processes inputs locally and does not send them to advertising integrations.
          Advertising scripts still make network requests; local processing does not isolate the
          page from third-party scripts.
        </p>
        <p>
          Exactly what advertising does and does not have access to is set out on the
          <a routerLink="/privacy">privacy page</a>, in plain language.
        </p>
        <p>
          If you would rather support the site directly than see ads, you can
          <a [href]="donationUrl" target="_blank" rel="noopener nofollow">buy me a coffee</a>.
          It is genuinely optional: there is no membership, no ad-free tier and nothing withheld
          from anyone who does not.
        </p>

        <h2>You can read the code</h2>
        <p>
          The whole site is open source, on
          <a [href]="sourceUrl" target="_blank" rel="noopener">GitHub</a>, under the
          {{ licenseName }} licence. That matters more here than it would on most projects: the
          central claim is about what this software does <em>not</em> do, and a claim like that is
          worth more when you can check it than when you are asked to take it on trust.
        </p>
        <p>
          To inspect a particular workflow, use synthetic input and watch the Network tab in
          your browser's developer tools. Distinguish application downloads, analytics and ad
          requests from tool processing. Test that workflow offline too. These checks provide
          evidence about that session, not a security guarantee for future code or third-party scripts.
        </p>
        <p>
          The licence is deliberate. {{ licenseName }} lets anyone run, study, modify and self-host
          this, commercially included — but if someone modifies it and offers it to others over a
          network, they have to publish their changes too. A permissive licence would let a
          modified, closed copy be run as a competing service with nothing given back.
        </p>

        <h2>What is not here</h2>
        <p>
          No account system, no cloud storage, no sync between devices, no team features and no
          paid tier. Those would all require a backend, and the absence of a backend is the entire
          point. If you need a tool that remembers your work across machines, this is the wrong
          site — and that is a deliberate trade.
        </p>

        <h2>Get in touch</h2>
        <p>
          Bug reports and tool requests go to
          <a [href]="'mailto:' + email.support">{{ email.support }}</a>, anything else to
          <a [href]="'mailto:' + email.contact">{{ email.contact }}</a> — see the
          <a routerLink="/contact">contact page</a> for which is which. Requests for a tool that
          would need a server get an honest no rather than a maybe.
        </p>
      </div>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly toolService = inject(ToolService);

  protected readonly toolCount = this.toolService.tools().length;
  protected readonly author = SITE_AUTHOR;
  protected readonly founded = SITE_FOUNDED;
  protected readonly email = EMAIL;
  protected readonly donationUrl = DONATION_URL;
  protected readonly sourceUrl = SOURCE_URL;
  protected readonly licenseName = LICENSE_NAME;

  ngOnInit(): void {
    this.seo.apply({
      title: 'About',
      description: `Who builds OnDevice Tools, how ${this.toolCount} browser-based utilities run without a server, and how the site is funded.`,
      path: '/about',
    });
  }
}
