<div style="padding: 1rem 1.5rem 0;">
    <a
      href="{{ route('dashboard') }}"
      style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem; background: #6366f1; color: #fff; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; text-decoration: none;"
    >
        &#8592; Back to App
    </a>
</div>

<x-pulse>
    <livewire:pulse.servers cols="full" />

    <livewire:pulse.usage cols="4" rows="2" />

    <livewire:pulse.queues cols="4" />

    <livewire:pulse.cache cols="4" />

    <livewire:pulse.slow-queries cols="8" />

    <livewire:pulse.exceptions cols="6" />

    <livewire:pulse.slow-requests cols="6" />

    <livewire:pulse.slow-jobs cols="6" />

    <livewire:pulse.slow-outgoing-requests cols="6" />
</x-pulse>
